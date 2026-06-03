import { useGetMeQuery, useLogoutMutation, api } from '@/store/api';
import { useDispatch } from 'react-redux';

export function useAuth() {
  const { data, isLoading, refetch } = useGetMeQuery();
  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await logoutApi({}).unwrap();
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      // Clear the RTK Query cache to reset the app state
      dispatch(api.util.resetApiState());
    }
  };

  return {
    userId: data?.userId || null,
    username: data?.username || null,
    isLoading,
    refetch,
    logout,
  };
}
