import { Alret, alretContext } from "context/AlretContext";
import { FC, useCallback, useRef, useState } from "react";
import * as S from "./styles";
import AlretComponent, { AlretRef } from "../../Alert";

const AlretProvider: FC = ({ children }) => {
  const [alrets, setAlrets] = useState<Alret[]>([]);
  const currentAlretRef = useRef<AlretRef>();

  const showAlret = useCallback(
    async (alret: Alret) => {
      if (currentAlretRef.current) {
        await currentAlretRef.current.closeAnimation();
      }

      setAlrets([...alrets, alret]);

      return;
    },
    [alrets]
  );

  return (
    <alretContext.Provider value={{ showAlret }}>
      {children}
      <S.Container>
        {alrets.length !== 0 && (
          <AlretComponent ref={currentAlretRef} {...alrets.reverse()[0]} />
        )}
      </S.Container>
    </alretContext.Provider>
  );
};

export default AlretProvider;
