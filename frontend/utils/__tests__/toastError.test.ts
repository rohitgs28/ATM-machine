import { toUserMessage, toastFromError } from '../toastError';

describe('toUserMessage', () => {
  it('returns userMessage when provided', () => {
    const err: unknown = { userMessage: 'Invalid account', message: 'Internal detail' };
    expect(toUserMessage(err)).toBe('Invalid account');
  });

  it('parses array details from JSON', () => {
    const body = { detail: [{ msg: 'Field a is required' }, { msg: 'Field b is invalid' }] };
    const err: unknown = { message: JSON.stringify(body) };
    expect(toUserMessage(err)).toBe('Field a is required\nField b is invalid');
  });

  it('returns fallback message for unknown errors', () => {
    const err: unknown = { message: 'unknown' };
    expect(toUserMessage(err)).toBe('Something went wrong. Please check your input and try again.');
  });
});

describe('toastFromError', () => {
  it('wraps the message into a toast options object', () => {
    const err: unknown = { userMessage: 'Oops' };
    const toast = toastFromError(err);
    expect(toast.status).toBe('error');
    expect(toast.title).toBe('Request failed');
    expect(toast.description).toBe('Oops');
    expect(toast.isClosable).toBe(true);
  });
});
