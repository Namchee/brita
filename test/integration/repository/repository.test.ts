/**
 * This is an integration testing
 * I don't think there's a merit of unit testing on custom repository
 * as we mocked the result itself and can't really 'break' it
 *
 * NOT MEANT TO BE INTERGRATED WITH CI!!!
 */

import {
  AnnouncementRepositoryTypeORM,
} from '../../../src/repository/announcement';
import { CategoryRepositoryTypeORM } from '../../../src/repository/category';
import { connectToDatabase } from '../../../src/database/connection';
import chai from 'chai';
import { CategoryEntity } from '../../../src/database/model/category';
import { Connection, Repository } from 'typeorm';
import { Category } from '../../../src/entity/category';
import { StateRepositoryTypeORM } from '../../../src/repository/state';
import { State } from '../../../src/entity/state';
import { StateEntity } from '../../../src/database/model/state';
import { ServerError } from '../../../src/utils/error';
import { readFileSync } from 'fs';

const expect = chai.expect;

describe('Repository integration test', () => {
  let connection: Connection;

  before(async () => {
    connection = await connectToDatabase();
  
    const testScript = readFileSync('setup.for.test.sql').toString();
  
    await connection.query(testScript);
  });
  
  after(async () => {
    connection.close();
  });

  describe('Announcement repository test', () => {
    let customRepo: AnnouncementRepositoryTypeORM;
    let categoryRepo: Repository<Category>;

    before(() => {
      categoryRepo = connection.getRepository(CategoryEntity);
      customRepo = connection
        .getCustomRepository(AnnouncementRepositoryTypeORM);
    });

    describe('findAll', () => {
      it('should return all announcement from test DB', async () => {
        const announcements = await customRepo.findAll();

        expect(announcements.length).to.equal(2);
        expect(announcements[0].title).to.equal('Test title');
        expect(announcements[1].title).to.equal('This is important');
      });
    });

    describe('findByCategory', () => {
      let categoryWithOneAnnouncement: Category;
      let categoryWithTwoAnnouncement: Category;
      let categoryWithZeroAnnouncement: Category;

      before(async () => {
        const categories = await categoryRepo.find();

        categoryWithOneAnnouncement = categories[0];
        categoryWithTwoAnnouncement = categories[1];
        categoryWithZeroAnnouncement = categories[2];
      });

      it('should return one announcement from test DB', async () => {
        const announcements = await customRepo.findByCategory(
          categoryWithOneAnnouncement,
        );

        expect(announcements.length).to.equal(1);
        expect(announcements[0].title).to.equal('Test title');
      });

      it('shoud return all announcement from test DB', async () => {
        const announcements = await customRepo.findByCategory(
          categoryWithTwoAnnouncement,
        );

        expect(announcements.length).to.equal(2);
        expect(announcements[0].title).to.equal('Test title');
        expect(announcements[1].title).to.equal('This is important');
      });

      it('shoud return no announcement from test DB', async () => {
        const announcements = await customRepo.findByCategory(
          categoryWithZeroAnnouncement,
        );

        expect(announcements.length).to.equal(0);
      });
    });
  });

  describe('Category repository test', () => {
    let repo: CategoryRepositoryTypeORM;

    before(() => {
      repo = connection.getCustomRepository(CategoryRepositoryTypeORM);
    });

    describe('findAll', () => {
      it('should return all category from test DB', async () => {
        const categories = await repo.findAll();

        expect(categories.length).to.equal(3);

        expect(categories[0].name).to.equal('Test category');
        expect(categories[1].name).to.equal('Two announcement');
        expect(categories[2].name).to.equal('empty category');

        expect(categories[0].announcementCount).to.not.undefined;
        expect(categories[1].announcementCount).to.not.undefined;
        expect(categories[2].announcementCount).to.not.undefined;
      });
    });

    describe('findByName', () => {
      it('should return one category from test DB (exact case)', async () => {
        const category = await repo.findByName('Test category');

        expect(category).to.not.null;
      });

      it('should return one category from test DB (random case)', async () => {
        const category = await repo.findByName('TWo AnNouNceMEnT');

        expect(category).to.not.null;
      });

      it('should return `null`, because unsatisfiable criterion', async () => {
        const category = await repo.findByName('should return null');

        expect(category).to.be.null;
      });
    });
  });

  describe('State repository test', () => {
    let repo: StateRepositoryTypeORM;
    let origRepo: Repository<State>;

    before(() => {
      repo = connection.getCustomRepository(StateRepositoryTypeORM);
      origRepo = connection.getRepository(StateEntity);
    });

    describe('findById', () => {
      it('should return a user state', async () => {
        const userState = await repo.findById('id');

        expect(userState).to.not.null;
      });

      it('should return null because state does not exist', async () => {
        const userState = await repo.findById('does_not_exist');

        expect(userState).to.be.null;
      });
    });

    describe('create', () => {
      it('should create a new user state', async () => {
        const savedUser = await repo.create('new_id', 'pengumuman', 1, 'hehe');

        expect(savedUser).to.be.true;

        const userState = await origRepo.find({ id: 'new_id' });

        expect(userState).to.not.null;
      });

      it('should be rejected because state already exist', async () => {
        const query = repo.create('id', 'pengumuman', 1, 'pengumuman One');

        expect(query).to.be.rejectedWith(ServerError);
      });
    });

    describe('update', () => {
      it('should return `true` because update is successful', async () => {
        const query = await repo.update({
          id: 'id',
          service: '',
          text: 'pengumuman One 10',
          state: 2,
        });

        expect(query).to.be.true;

        const updated = await origRepo.findOne({ id: 'id' });

        expect(updated).to.not.null;
        expect(updated?.state).to.equal(2);
        expect(updated?.text).to.equal('pengumuman One 10');
      });

      it('should return `false` because state does not exist', async () => {
        const query = await repo.update({
          id: 'not_exist',
          service: '',
          text: 'pengumuman One 10',
          state: 2,
        });

        expect(query).to.be.false;
      });
    });

    describe('delete', () => {
      it('should delete a user state successfuly', async () => {
        const deleteResult = await repo.delete('id');

        expect(deleteResult).to.be.true;

        const checkDeletedState = await origRepo.findOne({ id: 'id' });

        expect(checkDeletedState).to.be.undefined;
      });

      it('should return `false` because state does not exist', async () => {
        const deleteResult = await repo.delete('not_exist');

        expect(deleteResult).to.be.false;
      });
    });
  });
});
