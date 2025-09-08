const pushMock = jest.fn();
const replaceMock = jest.fn();
const prefetchMock = jest.fn().mockResolvedValue(undefined);

module.exports = {
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
    prefetch: prefetchMock,
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  // expose mocks so tests can assert on them if desired
  __esModule: true,
  pushMock,
  replaceMock,
  prefetchMock,
};
