import {
  AnnouncementRepositoryTypeORM,
} from '../../src/repository/announcement';
import { CategoryRepositoryTypeORM } from '../../src/repository/category';
import { BotAnnouncementService } from '../../src/services/bot/announcement';
import chai from 'chai';
import chaiPromise from 'chai-as-promised';
import { } from 'mocha';
import { Category } from '../../src/entity/category';
import { getManager } from 'typeorm';
import sinon from 'sinon';
import { ServerError } from '../../src/utils/error';

chai.use(chaiPromise);

const assert = chai.assert;

const tommorow = new Date();
tommorow.setDate(tommorow.getDate() + 1);

const categories: Category[] = [
  {
    id: 1,
    name: 'One',
    desc: 'This is category one',
  },
  {
    id: 2,
    name: 'Two',
    desc: 'This is category two',
  },
  {
    id: 3,
    name: 'Three',
    desc: 'This is category three',
  },
];

const announcements = [
  {
    id: 1,
    title: 'Announcement One',
    content: 'This is announcement one',
    validUntil: new Date(),
    important: false,
  },
  {
    id: 2,
    title: 'Announcement Two',
    content: 'This is announcement two',
    validUntil: new Date(),
    important: true,
  },
  {
    id: 3,
    title: 'Announcement Three',
    content: 'This is announcement three',
    validUntil: tommorow,
    important: true,
  },
];

const processedAnnouncement = [
  'Announcement Two\n\nThis is announcement two',
  'Announcement Three\n\nThis is announcement three',
  'Announcement One\n\nThis is announcement one',
];

describe('Bot service test', () => {
  describe('Announcement service test', () => {
    let botService: BotAnnouncementService;

    before(() => {
      const announcementRepositoryMock = new AnnouncementRepositoryTypeORM(
        getManager(),
      );

      sinon.stub(announcementRepositoryMock, 'findByCategory')
        .withArgs(categories[0])
        .returns(Promise.resolve(announcements))
        .withArgs(categories[2])
        .returns(Promise.resolve([]));

      const categoryRepositoryMock = new CategoryRepositoryTypeORM(
        getManager(),
      );

      sinon.stub(categoryRepositoryMock, 'findAll')
        .returns(Promise.resolve(categories));

      sinon.stub(categoryRepositoryMock, 'findByName')
        .withArgs(categories[0].name)
        .returns(Promise.resolve(categories[0]))
        .withArgs(categories[2].name)
        .returns(Promise.resolve(null));

      botService = new BotAnnouncementService(
        announcementRepositoryMock,
        categoryRepositoryMock,
      );
    });

    it('should throw a server error caused by negative state', async () => {
      const serviceParams = {
        state: -1,
        text: '',
      };

      assert.isRejected(
        botService.handle(serviceParams),
        ServerError,
        'ServerError: Invalid state of -1',
      );
    });

    describe('First handler testing', () => {
      it('should throw a server error caused by wrong commands', () => {
        const serviceParams = {
          state: 0,
          text: 'subscribe',
        };

        assert.isRejected(
          botService.handle(serviceParams),
          ServerError,
          'ServerError: Incorrect service mapping',
        );
      });

      it('should return a list of categories', async () => {
        const serviceParams = {
          state: 0,
          text: 'pengumuman',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, 1, 'The result state should be 1');
      });
    });

    describe('Second handler testing', () => {
      it('should throw a user error because category not found', async () => {
        const serviceParams = {
          state: 1,
          text: 'pengumuman Three',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, -2, 'The current state should be -2');
      });

      it('should request an amount of categories requested', async () => {
        const serviceParams = {
          state: 1,
          text: 'pengumuman One',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, 2, 'The result state should be 2');
      });
    });

    describe('Third handler testing', async () => {
      it('should throw a server error because category not found', async () => {
        const serviceParams = {
          state: 2,
          text: 'pengumuman Three 10',
        };

        assert.isRejected(
          botService.handle(serviceParams),
          ServerError,
          'ServerError: Breach of flow, should be killed earlier',
        );
      });

      it(
        'should throw a user error because the amount is not a number',
        async () => {
          const serviceParams = {
            state: 2,
            text: 'pengumuman One Numberrr',
          };

          const result = await botService.handle(serviceParams);

          assert.strictEqual(result.state, -2, 'The result state should be -2');
        },
      );

      it(
        'should throw a user error because the requested amount is too much',
        async () => {
          const serviceParams = {
            state: 2,
            text: 'pengumuman One 11',
          };

          const result = await botService.handle(serviceParams);

          assert.strictEqual(result.state, -2, 'The result state should be -2');
        },
      );

      it(
        'should throw a user error because the requested amount is too little',
        async () => {
          const serviceParams = {
            state: 2,
            text: 'pengumuman One -1',
          };

          const result = await botService.handle(serviceParams);

          assert.strictEqual(result.state, -2, 'The result state should be -2');
        },
      );

      it('should return a list of announcements (all)', async () => {
        const serviceParams = {
          state: 2,
          text: 'pengumuman One 3',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, 0, 'The state should be 0');

        const announcementText = result.message[1].body;

        assert.strictEqual(
          announcementText.length,
          3,
          'There should be 3 announcement',
        );

        for (let i = 0; i < announcementText.length; i++) {
          assert.strictEqual(
            announcementText[i].text,
            processedAnnouncement[i],
          );
        }
      });

      it('should return a list of announcements (partial)', async () => {
        const serviceParams = {
          state: 2,
          text: 'pengumuman One 2',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, 0, 'The state should be 0');

        const announcementText = result.message[1].body;

        assert.strictEqual(
          announcementText.length,
          2,
          'There should be 2 announcement',
        );

        for (let i = 0; i < announcementText.length; i++) {
          assert.strictEqual(
            announcementText[i].text,
            processedAnnouncement[i],
          );
        }
      });
    });

    // need a better name for this
    describe('Multiple parameter from zero state testing', () => {
      it('should return push message error', async () => {
        const serviceParams = {
          state: 0,
          text: 'pengumuman Three',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(
          result.state,
          1,
          'The service should maintain previous successful state',
        );

        assert.strictEqual(
          result.message.length,
          2,
          'The service should only push 2 messages',
        );
      });

      it('should handle the state until it reached second state', async () => {
        const serviceParams = {
          state: 0,
          text: 'pengumuman One',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, 2, 'The result state should be 2');
      });

      it('should handle the state until it finished the request', async () => {
        const serviceParams = {
          state: 0,
          text: 'pengumuman One 2',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, 0, 'The state should be 0');

        const announcementText = result.message[1].body;

        assert.strictEqual(
          announcementText.length,
          2,
          'There should be 2 announcement',
        );

        for (let i = 0; i < announcementText.length; i++) {
          assert.strictEqual(
            announcementText[i].text,
            processedAnnouncement[i],
          );
        }
      });
    });

    describe('Multiple parameters from non-zero state testing', () => {
      it('should handle the state until it finished the request', async () => {
        const serviceParams = {
          state: 1,
          text: 'pengumuman One 2',
        };

        const result = await botService.handle(serviceParams);

        assert.strictEqual(result.state, 0, 'The state should be 0');

        const announcementText = result.message[1].body;

        assert.strictEqual(
          announcementText.length,
          2,
          'There should be 2 announcement',
        );

        for (let i = 0; i < announcementText.length; i++) {
          assert.strictEqual(
            announcementText[i].text,
            processedAnnouncement[i],
          );
        }
      });
    });
  });
});
