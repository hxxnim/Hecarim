import React, { useState, useEffect, FC, useContext } from "react";
import { Camera } from "expo-camera";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CameraStackParamList } from "..";
import { Asset } from "expo-asset";
import { MAX_DURATION, SCREEN_RATIO } from "../../../constant/camera";
import * as ImagePicker from "expo-image-picker";
import * as S from "./styles";
import { cameraContext } from "context/CameraContext";
import isStackContext from "context/IsStackContext";
import useMainStackNavigation from "hooks/useMainStackNavigation";

interface Props {
  route?: {
    params: {
      questionId: number;
    };
  };
}

type screenProp = StackNavigationProp<CameraStackParamList, "CameraDetail">;

const CameraComponent: FC<Props> = ({ route }): JSX.Element => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(
    null
  );
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
  const [cameraRef, setCameraRef] = useState<null | Camera>(null);
  const [bestRatio, setBestRatio] = useState<string>();
  const [isPickingVideo, setIsPickingVideo] = useState<boolean>(false);
  const { setUri } = useContext(cameraContext);
  const isAnswer = useContext(isStackContext);
  const [blockRecord, setBlockRecord] = useState(false);

  const cameraNavigation = useNavigation<screenProp>();
  const mainNavigation = useMainStackNavigation();

  const isFocused = useIsFocused();

  const rotateImg = require("../../../assets/icons/rotate.png");
  const recordingImg = require("../../../assets/icons/recording.png");
  const recordImg = require("../../../assets/icons/record.png");
  const videoImg = require("../../../assets/icons/video.png");
  const backImage = require("../../../assets/icons/back-white.png");

  useEffect(() => {
    (async () => {
      const { status: CameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: VoiceStatus } =
        await Camera.requestMicrophonePermissionsAsync();
      setHasCameraPermission(CameraStatus === "granted");
      setHasAudioPermission(VoiceStatus === "granted");
    })();
    cacheImage();
  }, []);

  //????????? ?????? ??????
  const cacheImage = () => {
    Promise.all([
      Asset.fromModule("../../../assets/icons/rotate.png").downloadAsync(),
      Asset.fromModule("../../../assets/icons/recording.png").downloadAsync(),
      Asset.fromModule("../../../assets/icons/record.png").downloadAsync(),
      Asset.fromModule("../../../assets/icons/video.png").downloadAsync(),
      Asset.fromModule("../../../assets/icons/back-white.png").downloadAsync(),
    ]);
  };

  //??????????????? ?????? ???????????? ??????
  const importMediaFromLibrary = async () => {
    setIsPickingVideo(true);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const videoData = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: ImagePicker.UIImagePickerControllerQualityType.High,
      base64: true,
      videoMaxDuration: MAX_DURATION,
      aspect: [4, 3],
      allowsEditing: true,
      allowsMultipleSelection: false,
    });

    if (permission.granted) {
      await videoData.then((res: ImagePicker.ImageInfo) => {
        if (!res.cancelled) {
          const isLongerThan60s = (res.duration ?? 0) / 1000 > MAX_DURATION;
          if (isLongerThan60s) {
            alert(
              "????????? ????????? 60?????? ????????????, ????????? ??? 60?????? ???????????????."
            );
          }
          setUri(res.uri);
          isAnswer
            ? mainNavigation.push("CameraDetail", {
                questionId: route.params.questionId,
              })
            : cameraNavigation.push("CameraDetail");
        }
      });
    }
    setIsPickingVideo(false);
  };

  //????????? ?????? ??????
  const onCameraReady = () => {
    getDeviceCameraRatio();
    setIsCameraReady(true);
  };

  //??????????????? ?????? ????????? ????????? ???????????? ??????
  const getDeviceCameraRatio = async () => {
    const ratio = await cameraRef.getSupportedRatiosAsync();
    const bestRatio = extractBestRatio(ratio);
    setBestRatio(bestRatio);
  };

  //??????????????? ?????? ????????? ????????? ????????? ??????
  const extractBestRatio = (availableRatioArray: string[]) => {
    const ratioObjectArray: { ratio: string; realRatio: number }[] = [];
    const arrayOfAbs: number[] = [];

    for (let i = 0; i < availableRatioArray.length; i++) {
      ratioObjectArray[i] = {
        ratio: availableRatioArray[i],
        realRatio:
          Number(availableRatioArray[i].split(":")[0]) /
          Number(availableRatioArray[i].split(":")[1]),
      };
    }

    for (let i = 0; i < ratioObjectArray.length; i++) {
      arrayOfAbs.push(Math.abs(SCREEN_RATIO - ratioObjectArray[i].realRatio));
    }

    const minRatio = Math.min.apply(Math, arrayOfAbs);
    const minRatioIndex = arrayOfAbs.findIndex((value) => value === minRatio);

    return availableRatioArray[minRatioIndex];
  };

  //????????? ?????? ??????
  const recordVideo = async () => {
    blockRecordButton();
    if (cameraRef && isFocused && !blockRecord) {
      setIsVideoRecording(true);
      const videoRecordPromise = await cameraRef.recordAsync({
        maxDuration: MAX_DURATION,
      });
      setUri(videoRecordPromise.uri);
      isAnswer
        ? mainNavigation.navigate("CameraDetail", {
            questionId: route.params.questionId,
          })
        : cameraNavigation.navigate("CameraDetail");
    }
  };

  //????????? ?????? ?????? ??????
  const stopVideoRecording = () => {
    if (cameraRef && !blockRecord) {
      cameraRef.stopRecording();
      setIsVideoRecording(false);
    }
    blockRecordButton();
  };

  //3????????? ?????? ????????? ?????? ??????
  const blockRecordButton = () => {
    setBlockRecord(true);
    setTimeout(() => {
      setBlockRecord(false);
    }, 3000);
  };

  //????????? ?????? ??????
  const switchCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  //????????? ??????????????? ???????????? ???????????? ui
  const renderVideoRecordIndicator = (): JSX.Element =>
    isVideoRecording ? (
      <S.RecordIndicatorContainer>
        <S.RecordDot />
        <S.RecordTitle>{"?????????"}</S.RecordTitle>
      </S.RecordIndicatorContainer>
    ) : (
      <S.RecordIndicatorContainer>
        <S.RecordTitle>?????? ????????? ?????? ???????????????</S.RecordTitle>
      </S.RecordIndicatorContainer>
    );

  //????????? ?????? ????????? ui
  const renderVideoControl = (): JSX.Element => (
    <S.Control bottom={isAnswer ? 60 : 100}>
      {isVideoRecording ? (
        // ???????????? ??????
        <S.RecordVideoContainer
          activeOpacity={0.7}
          disabled={!isCameraReady}
          onPress={stopVideoRecording}
        >
          <S.RecordingVideoImage source={recordingImg} />
        </S.RecordVideoContainer>
      ) : (
        // ???????????? ?????? ??????
        <>
          <S.GetVideoContainer onPress={importMediaFromLibrary}>
            <S.VideoImage source={videoImg} />
          </S.GetVideoContainer>
          <S.RecordVideoContainer onPress={recordVideo}>
            <S.RecordImageStyle source={recordImg} />
          </S.RecordVideoContainer>
          <S.FlipCameraContainer
            disabled={!isCameraReady}
            onPress={switchCamera}
          >
            <S.FlipCameraImage source={rotateImg} />
          </S.FlipCameraContainer>
        </>
      )}
    </S.Control>
  );

  if (hasAudioPermission === null || hasCameraPermission === null) {
    return (
      <S.Container>
        <S.Message>
          <S.Text>????????? ??????????????????...</S.Text>
        </S.Message>
      </S.Container>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <S.Container>
        <S.Message>
          <S.Text>???????????? ????????? ????????? ??????????????????</S.Text>
        </S.Message>
      </S.Container>
    );
  }

  if (hasAudioPermission === false) {
    return (
      <S.Container style={{ ...StyleSheet.absoluteFillObject }}>
        <S.Message>
          <S.Text>???????????? ????????? ?????? ????????? ??????????????????</S.Text>
        </S.Message>
      </S.Container>
    );
  }

  if (hasAudioPermission && hasCameraPermission) {
    return (
      <S.QuestionWrapper>
        <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
          {isAnswer ? (
            <S.GoBackContainer
              onPress={() => {
                cameraNavigation.pop(1);
              }}
            >
              <S.GoBackImage source={backImage} />
            </S.GoBackContainer>
          ) : (
            <></>
          )}
          {isFocused && !isPickingVideo && (
            <Camera
              ref={(el) => setCameraRef(el)}
              style={{ ...StyleSheet.absoluteFillObject }}
              type={cameraType}
              onCameraReady={onCameraReady}
              onMountError={(error) => {
                console.warn("cammera error", error);
              }}
              autoFocus={"on"}
              useCamera2Api
              ratio={bestRatio}
            />
          )}

          <View style={{ ...StyleSheet.absoluteFillObject }}>
            {renderVideoRecordIndicator()}
            {renderVideoControl()}
          </View>
        </SafeAreaView>
      </S.QuestionWrapper>
    );
  }
};

export default CameraComponent;
