module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^controllers/(.*)$': '<rootDir>/src/server/controllers/$1',
    '^model/(.*)$': '<rootDir>/src/server/database/model/$1',
    '^entity/(.*)$': '<rootDir>/src/server/entity/$1',
    '^repository/(.*)$': '<rootDir>/src/server/repository/$1',
    '^services/(.*)$': '<rootDir>/src/server/services/$1',
    '^botServices/(.*)$': '<rootDir>/src/server/services/bot/$1',
    '^utils/(.*)$': '<rootDir>/src/server/utils/$1',
    '^config/(.*)$': '<rootDir>/src/server/config/$1',
    '^routes/(.*)$': '<rootDir>/src/server/routes/$1',
  },
  verbose: true,
};
