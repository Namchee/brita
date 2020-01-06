/**
 * Meant to be tested later

import EasyGraphQLTester from 'easygraphql-tester';
import path from 'path';
import fs from 'fs';

const userSchema = fs.readFileSync(
  path.resolve(process.cwd(), 'src', 'graphql', 'schema.gql'),
  'utf8',
);

const tester = new EasyGraphQLTester(userSchema);

describe('GraphQL Schema Test', () => {
  describe('Query Test', () => {
    let query = '';

    describe('findAllAnnouncement', () => {
      it('should pass', () => {
        query = `
          {
            findAllAnnouncement {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(true, query);
      });

      it('should pass (paginated)', () => {
        query = `
          {
            findAllAnnouncement(
              page: {
                skip: 1,
                size: 10
              }
            ) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(true, query);
      });

      it('should fail because wrong pagination settings', () => {
        query = `
          {
            findAllAnnouncement(
              page: {
                skip: 1,
                size: 'wrong'
              }
            ) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because unknown pagination setting(s)', () => {
        query = `
          {
            findAllAnnouncement(
              page: {
                wrongAttribute: 1232131
              }
            ) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because of unknown argument(s)', () => {
        query = `
          {
            findAllAnnouncement(wrongArgument: 1) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because of unknown field(s)', () => {
        query = `
          {
            findAllAnnouncement {
              wrongField
            }
          }
        `;

        tester.test(false, query);
      });
    });

    describe('findAnnouncementByTag', () => {
      it('should pass', () => {
        query = `
          {
            findAnnouncementByTag(tag: 0) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(true, query);
      });

      it('should pass (paginated)', () => {
        query = `
          {
            findAnnouncementByTag(
              tag: 0,
              page: {
                skip: 1,
                size: 1
              }
            ) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(true, query);
      });

      it('should fail because wrong parameter type', () => {
        query = `
          {
            findAnnouncementByTag(
              tag: "wrong"
            ) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because wrong pagination settings parameter', () => {
        query = `
          {
            findAnnouncementByTag(
              tag: 0,
              page: {
                cursor: 1,
                size: "wrong"
              }
            ) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because unknown pagination settings parameter', () => {
        query = `
          {
            findAnnouncementByTag(
              tag: 0,
              page: {
                skip: 1,
                size: 1,
                wrong: 'wrong'
              }
            ) {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because missing required parameter(s)', () => {
        query = `
          {
            findAnnouncementByTag() {
              content
              validUntil
              tag
              important
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because unknown argument(s)', () => {
        query = `
          {
            findAnnouncementByTag(tag: 0, wrong: 213213213) {
              title
            }
          }
        `;

        tester.test(false, query);
      });

      it('should fail because unknown field(s)', () => {
        query = `
          {
            findAnnouncementByTag(tag: 1) {
              wrong
            }
          }
        `;

        tester.test(false, query);
      });
    });
  });
});
*/
