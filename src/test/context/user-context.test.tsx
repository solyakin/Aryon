import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { UserAuthContextProvider } from '../../context/user/user-context';
import { useUserAuthContext } from '../../context/user/user-hooks';
import type { ReactNode } from 'react';

describe('UserAuthContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <UserAuthContextProvider>{children}</UserAuthContextProvider>
  );

  it('should initialize with empty token', () => {
    const { result } = renderHook(() => useUserAuthContext(), { wrapper });
    expect(result.current.token).toBe('');
  });

  it('should update token when dispatching SET_TOKEN action', () => {
    const { result } = renderHook(() => useUserAuthContext(), { wrapper });
    
    act(() => {
      result.current.dispatch({
        type: 'SET_TOKEN',
        payload: 'test-token'
      });
    });

    expect(result.current.token).toBe('test-token');
  });

  it('should clear token when dispatching CLEAR_TOKEN action', () => {
    const { result } = renderHook(() => useUserAuthContext(), { wrapper });
    
    act(() => {
      result.current.dispatch({
        type: 'SET_TOKEN',
        payload: 'test-token'
      });
    });

    act(() => {
      result.current.dispatch({
        type: "LOG_OUT",
        payload: null
      });
    });
    expect(result.current.token).toBe('');
  });
});
