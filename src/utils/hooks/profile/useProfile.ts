import { profileRequest } from "modules/dto/request/profileRequest";
import {
  getProfile,
  getProfileQuestionList,
  reset,
} from "modules/redux/action/profile";
import { useDispatch } from "react-redux";
import useSelectState from "../default/useSelectState";

const useProfile = () => {
  const dispatch = useDispatch();
  const profileState = useSelectState().profile;
  const setState = {
    profile: (payload: profileRequest) => {
      dispatch(getProfile(payload));
    },
    questionList: (payload: profileRequest) => {
      dispatch(getProfileQuestionList(payload));
    },
    reset: () => {
      dispatch(reset());
    },
  };

  return {
    state: profileState,
    setState,
  };
};

export default useProfile;
