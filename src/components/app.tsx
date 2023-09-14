import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  ZakekeEnvironment,
  ZakekeViewer,
  ZakekeProvider,
} from "zakeke-configurator-react";
import Selector from "./selector";
import { DialogsRenderer } from "./dialog/Dialogs";
import useStore from "../Store";
//import watermarkImage from './public/watermarkImage.jpeg';

// const Layout = styled.div`
//     display: grid;
//     grid-template-columns: auto;
//     grid-gap: 40px;
//     height: 100%;
//     padding: 0px;
//     font-family: "Helvetica Now Text",Helvetica,Arial,sans-serif;
// `

const Layout = styled.div`
  display: flex; 
  flex  
  height: 50%;
  width: 50%
  padding: 40px;
  flex-direction: column;
`;

const MobileContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto auto;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const zakekeEnvironment = new ZakekeEnvironment();

const App: FunctionComponent<{}> = () => {
  const {
    isLoading,
    setPriceFormatter,
    setSelectedAttributeId,
    setSelectedGroupId,
    setSelectedStepId,
    isMobile,
    selectedGroupId,
    setIsMobile,
  } = useStore();

  const [resize, setResize] = useState(false);
  const resizeRef = useRef(false);
  resizeRef.current = resize;

  // Update tray preview open button, to update width height for ThreeDRendered
  const [selectedTrayPreviewOpenButton3D, selectTrayPreviewOpenButton3D] =
    useState<boolean | null>(false);

  const trayPreviewOpenButton3DFunc = (
    selectedTrayPreviewOpenButton3D: any
  ) => {
    // console.log(selectedTrayPreviewOpenButton3D,'han bhae');
    selectTrayPreviewOpenButton3D(selectedTrayPreviewOpenButton3D);
  };

  // Page resize
  useEffect(() => {
    const resizeFunction = () => {
      setResize(!resizeRef.current);
    };

    window.addEventListener("resize", resizeFunction);
    return () => window.removeEventListener("resize", resizeFunction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ZakekeProvider environment={zakekeEnvironment}>
      <div id="modal-container" className="css-1q5ttm8">
        <div className="css-1ecy5z8">
          {isMobile && (
            <Layout>
              <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f4f4f4",
                }}
              >
                <div
                  className="ThreeDRenderer"
                  style={
                    selectedTrayPreviewOpenButton3D
                      ? { width: "20vw", height: "20vh" }
                      : { 
                        aspectRatio: "1 / 1",
                        width: "100%",  
                        position: "absolute", 
                        top: "1em", 
                        bottom: "0", 
                        left: "0%" }
                  }
                >
                 
                  <ZakekeViewer />
                </div>
              </div>
              <Selector
                trayPreviewOpenButton3DFunc={trayPreviewOpenButton3DFunc}
              />
            </Layout>
          )}

          {!isMobile && (
            <>
            <Layout>
              <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  justifyContent: "center",
                  gridArea: "1 / 2 / 12 / 1",
                  backgroundColor: "#f4f4f4"
                }}
              >
                <div style={{
                  background: `url(../../watermark.jpeg) center center no-repeat`,
                  backgroundSize: `cover`,
                  filter:  `grayscale(100%)`,
                  opacity: '0.1',
                  position: 'absolute', // Add this for positioning
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '70%',
                }}>

                </div>
                <div
                  className="ThreeDRenderer"
                  style={
                    selectedTrayPreviewOpenButton3D
                      ? { width: "60vw", height: "60vh" }
                      : { width: "73vw", height: "73vh"}
                  }
                >                  
                  <ZakekeViewer />
                </div>
               
                {/* <div style={{zIndex: "4444",  
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"}}>
                <h1> ^ </h1>  
                </div> */}

              </div>
              
              <Selector
                trayPreviewOpenButton3DFunc={trayPreviewOpenButton3DFunc}
              />
            </Layout>
            
           </>
          )}
          <DialogsRenderer />
        </div>
      </div>
    </ZakekeProvider>
  );
};

export default App;
