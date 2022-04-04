import { Dimensions, Image, StyleSheet, ViewStyle } from "react-native";
import * as S from "./styles";
import FeedVideos from "../../components/FeedVideos";
import VideoAnswer from "components/VideoAnswer";
import React, { FC, useContext } from "react";
import { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  AnimateStyle,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";
import { LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback } from "react";
import uniqueId from "constant/uniqueId";
import { getVideoAnswerListResponse } from "modules/dto/response/answerResponse";
import isStackContext from "context/IsStackContext";
import useMainStackNavigation from "hooks/useMainStackNavigation";

const { height, width } = Dimensions.get("screen");
const navGap = 24;
interface WidthsType {
  question: number;
  answer: number;
}

const BackIcon = require("../../assets/icons/back.png");

const styles = StyleSheet.create({
  outer: {
    position: "relative",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    flex: 1,
  },
});

interface PropsType {
  questionList: string[];
  index: number;
  videoAnswerList: getVideoAnswerListResponse;
  getVideoAnswerList: () => void;
}

const QuestionList: FC<PropsType> = ({ questionList, index }) => {
  const [widths, setWidths] = useState<WidthsType>({ question: 0, answer: 0 });
  const pageOffset = useSharedValue<number>(0);
  const { top: topPad } = useSafeAreaInsets();
  const outerRef = useAnimatedRef<Animated.ScrollView>();
  const pageId = useSharedValue<string>(uniqueId());
  const isStack = useContext(isStackContext);
  const navigation = useMainStackNavigation();

  const questionNavStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pageOffset.value, [0, 1], [1, 0.4]),
    transform: [
      {
        translateX: interpolate(
          pageOffset.value,
          [0, 1],
          [0, -(widths.answer / 2) - navGap - widths.question / 2]
        ),
      },
    ],
  }));

  const answerNavStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pageOffset.value, [0, 1], [0.4, 1]),
    transform: [
      {
        translateX: interpolate(
          pageOffset.value,
          [0, 1],
          [widths.question / 2 + widths.question + navGap, 0]
        ),
      },
    ],
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      pageOffset.value = event.contentOffset.x / width;
    },
  });

  const onLayout = (name: keyof WidthsType) => (e: LayoutChangeEvent) =>
    setWidths({ ...widths, [name]: e.nativeEvent.layout.width });

  const NavStyle = useCallback(
    (name: keyof WidthsType): AnimateStyle<ViewStyle> => ({
      left: width / 2 - widths[name] / 2,
      top: topPad + 20,
      position: "absolute",
    }),
    [widths, topPad]
  );

  useDerivedValue(() => {
    // eslint-disable-next-line no-self-assign
    pageId.value = pageId.value;
  });

  return (
    <S.Wrapper style={{ height }}>
      <Animated.ScrollView
        ref={outerRef}
        style={styles.outer}
        decelerationRate="fast"
        snapToAlignment="start"
        pagingEnabled
        snapToInterval={width}
        horizontal
        bounces={false}
        bouncesZoom={false}
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={scrollHandler}
      >
        <FeedVideos dataList={questionList} index={index} />
        <VideoAnswer />
      </Animated.ScrollView>
      {isStack && (
        <S.BackButton onPress={() => navigation.pop()}>
          <Image
            source={BackIcon}
            style={{ height: 24, top: topPad + 20 }}
            resizeMode="contain"
          />
        </S.BackButton>
      )}
      <Animated.View
        style={[NavStyle("question"), questionNavStyle]}
        onLayout={onLayout("question")}
      >
        <S.NavText>질문</S.NavText>
      </Animated.View>
      <Animated.View
        style={[NavStyle("answer"), answerNavStyle]}
        onLayout={onLayout("answer")}
      >
        <S.NavText>영상 답변</S.NavText>
      </Animated.View>
    </S.Wrapper>
  );
};

export default QuestionList;
