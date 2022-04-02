import FacebookButton from "components/Buttons/Login/FacebookButton";
import GoogleButton from "components/Buttons/Login/GoogleButton";
import KakaoButton from "components/Buttons/Login/KakaoButton";
import NaverButton from "components/Buttons/Login/NaverButton";
import LoginHeader from "components/Header/Login";
import React, { FC } from "react";
import {
  Dimensions,
  ListRenderItem,
  SectionListData,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as S from "./style";

interface ButtonType {
  source: string;
  text: string;
}

const { height } = Dimensions.get("screen");

const Login: FC = () => {
  const { top: topPad } = useSafeAreaInsets();

  return (
    <S.Container>
      <LoginHeader />
      <S.Content height={height - (50 + topPad)}>
        <S.Title>세상의 모든 질문을,{"\n"} Knowing.</S.Title>
        <S.LoginBtnContainer>
          <S.LoginDescription>로그인 후 질문해보세요.</S.LoginDescription>
          <View>
            <GoogleButton />
            <NaverButton />
            <KakaoButton />
            <FacebookButton />
          </View>
        </S.LoginBtnContainer>
      </S.Content>
    </S.Container>
  );
};

export default Login;
