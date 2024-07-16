//import 'bootstrap/dist/css/bootstrap.css';
import "./selector.css";
import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { useZakeke } from "zakeke-configurator-react";
import {
  List,
  ListItem,
  ListItemImage,
  ListItemColor,
  ListItemColorNoCarousel,
} from "./list";
import { PreviewContainer, BlurOverlay } from "./previewContainer";
import Tray from "./Tray";
import TrayPreviewOpenButton from "./TrayPreviewOpenButton";
import MenuTriggerButton from "./MenuTriggerButton";
import ProgressBarLoadingOverlay from "./widgets/ProgressBarLoadingOverlay";
import Designer from "./layouts/Designer";
import { GroupItem, GroupIcon } from "./layouts/LayoutStyled";
import { createPortal } from "react-dom";
import useStore from "../Store";
import {
  ArrowLeft,
  ArrowLeftIconStyled,
  ArrowRight,
  ArrowRightIconStyled,
  CarouselContainer,
} from "./Atomic";
import { ReactComponent as ArrowRightIcon } from "../assets/icons/arrow-right-solid.svg";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow-left-solid.svg";
import { ReactComponent as ТrаыHeaderArrowRightIcon } from "../assets/icons/tray-header-arrow-right.svg";
import { ReactComponent as ТrаыHeaderArrowLeftIcon } from "../assets/icons/tray-header-arrow-left.svg";

import NukaCarousel from "nuka-carousel";
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";

const dialogsPortal = document.getElementById("dialogs-portal")!;

interface TrayPreviewOpenButton3DProps {
  trayPreviewOpenButton3DFunc: (data: any) => void;
}

const Selector: FunctionComponent<TrayPreviewOpenButton3DProps> = ({
  trayPreviewOpenButton3DFunc,
}) => {
  const {
    isSceneLoading,
    loadComposition,
    isAddToCartLoading,
    price,
    groups,
    selectOption,
    addToCart,
    templates,
    setTemplate,
    setCamera,
    productName,
    zoomIn,
    zoomOut,
    getPDF,
    items,
    product,
    setItemText,
    defaultColor,
    fonts,
    addItemText,
  } = useZakeke();

  const { setIsLoading, isMobile } = useStore();

  const swipper = useRef<any | null>(null);
  const intervalRef = useRef<any | null>(null);
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);

  const swiper = useSwiper();

  const startInterval = (direction: string) => {
    intervalRef.current = setInterval(() => {
      switch (direction) {
        case "prev":
          swipper.current.slidePrev();
          break;
        case "next":
          swipper.current.slideNext();
      }
    }, 350);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Keep saved the ID and not the refereces, they will change on each update
  const [selectedGroupId, selectGroup] = useState<number | null>(null);
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);

  const [selectedColorName, selectColorName] = useState<any | null>(null);

  // Get a list of all group names so we can populate on the tray
  const [selectedGroupList, selectGroupList] = useState<any | null>(null);

  // Open tray for menu
  const [isTrayOpen, setIsTrayOpen] = useState<any | null>(false);

  // Get the id of the selected group from the tray
  const [selectedGroupIdFromTray, selectGroupIdFromTray] = useState<
    number | null
  >(null);

  // Update tray preview open button
  const [selectedTrayPreviewOpenButton, selectTrayPreviewOpenButton] =
    useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [width, setWidth] = useState(window.innerWidth);

  // Selected attribute and options from here
  const [rightFootStrapAttr1, setRightFootStapAttr1] = useState<any | null>(
    null
  );
  const [rightFootStrapOption1, setRightFootStapOption1] = useState<any | null>(
    null
  );
  
  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedStep = selectedGroup
    ? selectedGroup.steps.find((step) => step.id === selectedStepId)
    : null;

  const [selectedPersonalize, setSelectedPersonalize] = useState<any | null>(
    false
  );

  // Attributes can be in both groups and steps, so show the attributes of step or in a group based on selection
  const attributes = useMemo(
    () => (selectedStep || selectedGroup)?.attributes ?? [],
    [selectedGroup, selectedStep]
  );
  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  // let indexToRemove = groups.findIndex((obj) => obj.id === -1);

  // if (indexToRemove !== -1) {
  //   groups.splice(indexToRemove, 1);
  // }

  let idsToRemove = [-1, 9341];

  idsToRemove.forEach((id) => {
    let indexToRemove = groups.findIndex((obj) => obj.id === id);
    while (indexToRemove !== -1) {
      groups.splice(indexToRemove, 1);
      indexToRemove = groups.findIndex((obj) => obj.id === id);
    }
  });

  const dialogsPortal = document.getElementById("dialogs-portal");

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      //   setHeight(window.innerHeight);
    };

    //window.addEventListener('resize', handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Open the first group and the first step when loaded
  useEffect(() => {
    if (!selectedGroup && groups.length > 0) {
        // console.log("items", items, "groups", groups, "product", product);

      selectGroup(groups[0].id);

      if (groups[0].steps.length > 0) selectStep(groups[0].steps[0].id);
console.log(templates,'templates');

      if (templates.length > 0) setTemplate(templates[0].id);
    }

    if (groups.length > 0) {
      var groupRec: string[] = [];
      groups.map((group) => {
        groupRec.push(group.name);
      });
      selectGroupList(groupRec);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, groups]);

  // useEffect(() => {
  // 	const textItems = items.filter((item) => item.type === 0) // as TextItem[];
  // 	//const newItems = textItems.filter((item) => !prevItems.some((prevItem) => prevItem.guid === item.guid));
  // 	// newItems.forEach((item) => {
  // 	// 	if (item.isTemplateElement) setItemText(item.guid, T._d(item.text));
  // 	// });
  // 	// setPrevItems(textItems);

  //   textItems.map((item) => {
  //     setItemText(item.guid,'first tezzt')
  //   })

  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [items]);

  // Select attribute first time
  useEffect(() => {
    if (!selectedAttribute && attributes.length > 0)
      selectAttribute(attributes[0].id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, attributes]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;
      if (camera) setCamera(camera);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);


  // Initial template selection
  useEffect(() => {
    if (templates.length > 0) 
               setTemplate(templates[0].id);
}, [templates]);

  const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);
  const slidesToShow = Math.floor(window.innerWidth / 81);

  // const carouselClass = slides.length <= 7 ? 'small-slider' : 'large-slider';
  const handleAfterSlide = (currentSlide: any) => {
    setSelectedCarouselSlide(currentSlide);
    console.log(
      "Now SelectedCarouselSlide:",
      setSelectedCarouselSlide(currentSlide),
      selectedCarouselSlide
    );
  };
  // console.log(slidesToShow, "selectedCarouselSlide");

  if (isSceneLoading || !groups || groups.length === 0)
    return (
      <PreviewContainer>
        <BlurOverlay>
          {/* <span>Loading scene...</span>; */}
          <ProgressBarLoadingOverlay />
        </BlurOverlay>
      </PreviewContainer>
    );

  // groups
  // -- attributes
  // -- -- options
  // -- steps
  // -- -- attributes
  // -- -- -- options

  const handleLeftClick = () => {
    //setSelectedCarouselSlide(0);
    selectColorName("");
    setCurrentIndex((currentIndex - 1 + groups.length) % groups.length);
    selectGroup(groups[(currentIndex - 1 + groups.length) % groups.length].id);
  };

  const handleRightClick = () => {
    //setSelectedCarouselSlide(0);
    selectColorName("");
    setCurrentIndex((currentIndex + 1) % groups.length);
    selectGroup(groups[(currentIndex + 1) % groups.length].id);
  };

  const toggleTray = () => {
    if (selectedTrayPreviewOpenButton) {
      selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);
    }
    // trayPreviewOpenButton();
    setIsTrayOpen(!isTrayOpen);
  };

  const trayPreviewOpenButton = () => {
    selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);

    //trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
    trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
  };

  const groupIdFromFunc = (data: any) => {
    //console.log('ayyy',groups,data);
    const filteredArray = groups.filter((group) => group.name === data);
    // const filteredArrayId = groups.filter((group) => group.name === data);

    //  console.log(filteredArrayId, 'sddfasfdafdsf');

    const filteredArrayId = groups.filter((i: any, index: number) => {
      // Perform the desired comparison
      return i.name === data;
    });

    if (filteredArrayId.length > 0) {
      const foundItem = filteredArrayId[0];
      const foundItemId = foundItem.id;
      const foundItemIndex = groups.indexOf(foundItem);
      // console.log("Found ID:", foundItemId);
      // console.log("Found Index:", foundItemIndex);
      setCurrentIndex(foundItemIndex);
    }

    selectGroup(filteredArray[0].id);
    selectGroupIdFromTray(filteredArray[0].id);
  };

  const containerStyles = {
    overflow: "auto",
    width: "100%",
    height: "180px",
  };

  return (
    <>
      {/* <GroupItem   */}

      <div className="animate-wrapper-0">
        <div style={containerStyles}>
          <div className="tray-header">
            <div
              style={{
                display: "flex",
                width: "420px",
                top: "43%",
                left: "50%",
                height: "auto",
                margin: "0px auto",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {width > 420 && (
                <span
                  style={{
                    // fontSize: "18px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    lineHeight: "28px",
                    position: "absolute",
                    right: "105%",
                    color: "#a3a3a3",
                    fontFamily: "Open Sans , sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {currentIndex != 0 && groups[currentIndex - 1].name}
                </span>
              )}

              <button
                className="previous-customization"
                onClick={handleLeftClick}
              >
                <div className="mc-prev">
                  <ТrаыHeaderArrowLeftIcon />
                </div>
              </button>

              <div className="tray-header-1">
                <div
                  style={{
                    position: "absolute",
                    padding: "0px",
                    width: "100%",
                  }}
                >
                  <div className="active-marketing-component-name">
                    <span
                      style={{
                        // fontSize: "18px",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        lineHeight: "28px",
                      }}
                    >
                      {groups[currentIndex].name}
                    </span>
                  </div>
                </div>
              </div>
              <button className="next-customization" onClick={handleRightClick}>
                <ТrаыHeaderArrowRightIcon />
              </button>
              {width > 420 && (
                <span
                  style={{
                    // fontSize: "18px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    lineHeight: "28px",
                    position: "absolute",
                    left: "105%",
                    color: "#a3a3a3",
                    fontFamily: "Open Sans , sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {currentIndex + 1 < groups.length &&
                    groups[currentIndex + 1].name}
                </span>
              )}
            </div>
          </div>

          <br />

          <div className={`animate-wrapper${isTrayOpen ? "-2 show" : ""}`}>
            {/* {selectedGroup &&
              !selectedTrayPreviewOpenButton &&
              selectedGroup.steps.length > 0 &&
              !isTrayOpen && (
                <div style={{ backgroundColor: "#DDD", width: "100vw" }}>
                  <List>
                    {selectedGroup.steps.map((step) => {
                      return (
                        <ListItem
                          key={step.id}
                          onClick={() => selectStep(step.id)}
                          selected={selectedStep === step}
                        >
                          Step: {step.name}
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              )} */}

            {!selectedTrayPreviewOpenButton && (
              <div style={{ width: "100vw" }}>
                <div style={{ height: "60px", backgroundColor: "#d7d7d7" }}>
                  <List>
                    <div
                      style={{
                        height: "40px",
                        display: "flex",
                        width: "100vw",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgb(229 229 229)",
                      }}
                    >
                      {attributes &&
                      !isTrayOpen &&
                      attributes.length > 2 &&
                      width < 400 ? (
                        <Swiper
                          spaceBetween={90}
                          slidesPerView={"auto"}
                          centeredSlides={true}
                          modules={[Navigation]}
                        >
                          {attributes &&
                            !isTrayOpen &&
                            attributes.map((attribute) => {
                              //console.log(groups);
                              //console.log(rightFootStrapOption1, attribute.name, 'ddddd',rightFootStrapOption1?.match(/\d+/)[0],  attribute.name?.match(/\d+/)[0]  );
                              //console.log(selectedAttribute === attribute, 'selectedAttribute === attribute');
                              if (attribute.enabled === true) {
                                return (
                                  <>
                                    <SwiperSlide>
                                      <div
                                        className="ddd"
                                        style={{
                                          height: "40px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          bottom: "-16%",
                                          position: "relative",
                                        }}
                                      >
                                        <ListItem
                                          key={attribute.id}
                                          selected={
                                            selectedAttribute === attribute
                                          }
                                          onClick={() => {
                                            selectAttribute(attribute.id);
                                            // setSelectedCarouselSlide(0);
                                          }}
                                        >
                                          {attribute.enabled === true &&
                                            attribute.name}
                                        </ListItem>
                                      </div>
                                    </SwiperSlide>
                                  </>
                                );
                              }
                            })}
                        </Swiper>
                      ) : (
                        attributes.map((attribute) => {
                          // console.log(groups);
                          // console.log(rightFootStrapOption1, attribute.name, 'ddddd',rightFootStrapOption1?.match(/\d+/)[0],  attribute.name?.match(/\d+/)[0]  );
                          //console.log(selectedAttribute === attribute, 'selectedAttribute === attribute');
                          if (attribute.enabled === true) {
                            return (
                              <div
                                className="ddd"
                                style={{
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <ListItem
                                  key={attribute.id}
                                  selected={selectedAttribute === attribute}
                                  onClick={() => {
                                    selectAttribute(attribute.id);
                                    // setSelectedCarouselSlide(0);
                                  }}
                                >
                                  {attribute.enabled === true && attribute.name}
                                </ListItem>
                              </div>
                            );
                          }
                        })
                      )}
                    </div>
                  </List>
                </div>

                <br />

                {/* NUKA CAROUSEL WHICH IS LESS THAN 16 slides and need to contract */}

                {selectedAttribute &&
                  selectedAttribute.options.length < slidesToShow && (
                    <div
                      style={{
                        backgroundColor: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "6vh",
                        width: "100vw",
                      }}
                    >
                      <List style={{ backgroundColor: "#fff", height: "80px" }}>
                        {!selectedTrayPreviewOpenButton &&
                          selectedAttribute &&
                          !isTrayOpen && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                position: "relative",
                                bottom: "35%",
                              }}
                            >
                              {selectedAttribute.options.map((option) => (
                                <ListItemColorNoCarousel
                                  key={option.id}
                                  onClick={() => {
                                    selectOption(option.id);
                                  }}
                                  selected={option.selected}
                                  selectedColor={selectedColorName}
                                >
                                  {option.imageUrl && (
                                    <ListItemImage
                                      src={option.imageUrl}
                                      onClick={() =>
                                        selectColorName(option.name)
                                      }
                                      selected={option.selected}
                                    />
                                  )}
                                </ListItemColorNoCarousel>
                              ))}
                            </div>
                          )}
                      </List>
                    </div>
                  )}

                {/* NUKA CAROUSEL WHICH IS GREATER THAN 16 slides  */}

                {selectedAttribute &&
                  selectedAttribute.options.length >= slidesToShow &&
                  width > 400 && (
                    <div
                      style={{
                        backgroundColor: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "12vh",
                        width: "90vw",
                        paddingLeft: "5em",
                      }}
                    >
                      <div
                        ref={navigationPrevRef}
                        style={{
                          position: "absolute",
                          width: "8em",
                          left: "7em",
                          height: "5em",
                          zIndex: "2",
                          backgroundColor: "transparent",
                          color: "transparent",
                        }}
                        onMouseEnter={() => {
                          startInterval("prev");
                        }}
                        onMouseLeave={() => {
                          stopInterval();
                        }}
                      >
                        "Left"
                      </div>

                      <List style={{ backgroundColor: "#fff", height: "80px" }}>
                        {!selectedTrayPreviewOpenButton &&
                          selectedAttribute &&
                          !isTrayOpen && (
                            <>
                              <Swiper
                                spaceBetween={1}
                                slidesPerView={12}
                                navigation={true}
                                onSwiper={(swiper) => {
                                  // Save the Swiper instance to the ref when it's ready
                                  console.log("initizalize swipper", swipper);

                                  swipper.current = swiper;
                                  console.log("swipper current", swipper);
                                }}
                                ref={swipper}
                                modules={[Autoplay, Navigation]}
                              >
                                {selectedAttribute.options.map((option) => (
                                  <SwiperSlide>
                                    <>
                                      <ListItemColor
                                        key={option.id}
                                        onClick={() => {
                                          selectOption(option.id);
                                        }}
                                        selected={option.selected}
                                        selectedColor={selectedColorName}
                                      >
                                        {option.imageUrl && (
                                          <ListItemImage
                                            src={option.imageUrl}
                                            onClick={() =>
                                              selectColorName(option.name)
                                            }
                                            selected={option.selected}
                                          />
                                        )}
                                      </ListItemColor>
                                    </>
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </>

                            // <NukaCarousel
                            //   slideWidth="80px"
                            //   slidesToScroll={51}
                            //   speed={5}
                            //   slidesToShow={slidesToShow}

                            //   slideIndex={selectedCarouselSlide}
                            //   afterSlide={setSelectedCarouselSlide}
                            //   //afterSlide={(v) => setSelectedCarouselSlide(v)}
                            //   //afterSlide={handleAfterSlide}
                            //   //afterSlide={console.log(currentSlide)}
                            //   renderBottomCenterControls={() => <span />}
                            //   renderCenterRightControls={() => {
                            //     // console.log(selectedAttribute.options,'selectedAttribute.options');
                            //     // if (selectedAttribute.options.length <= slidesToShow)
                            //     //   return <></>;
                            //     // if (
                            //     //   selectedAttribute.options.length <= slidesToShow
                            //     // )
                            //     //  return <></>;
                            //     //console.log(selectedCarouselSlide, selectedAttribute.options.length,
                            //       //  slidesToShow
                            //       //);

                            //     if (
                            //       // selectedCarouselSlide !==
                            //       // (
                            //         selectedAttribute.options.length - slidesToShow > 0
                            //         // ? selectedAttribute.options.length - slidesToShow
                            //         // /: selectedCarouselSlide)
                            //     )
                            //       return (
                            //         <ArrowRight
                            //           onClick={() =>
                            //             setSelectedCarouselSlide(
                            //               selectedCarouselSlide + 1
                            //             )
                            //           }
                            //         >
                            //           <ArrowRightIconStyled>
                            //             <ArrowRightIcon />
                            //           </ArrowRightIconStyled>
                            //         </ArrowRight>
                            //       );
                            //   }}
                            //   renderCenterLeftControls={() => {
                            //     if (selectedCarouselSlide !== 0)
                            //       return (
                            //         <ArrowLeft
                            //           onClick={() =>
                            //             setSelectedCarouselSlide(
                            //               selectedCarouselSlide - 1
                            //             )
                            //           }
                            //         >
                            //           <ArrowLeftIconStyled>
                            //             <ArrowLeftIcon />
                            //           </ArrowLeftIconStyled>
                            //         </ArrowLeft>
                            //       );
                            //   }}
                            // >
                            //   {selectedAttribute.options.map((option) => (
                            //     <>
                            //       <ListItemColor
                            //         key={option.id}
                            //         onClick={() => {
                            //           selectOption(option.id);
                            //         }}
                            //         selected={option.selected}
                            //         selectedColor={selectedColorName}
                            //       >
                            //         {option.imageUrl && (
                            //           <ListItemImage
                            //             src={option.imageUrl}
                            //             onClick={() => selectColorName(option.name)}
                            //             selected={option.selected}
                            //           />
                            //         )}
                            //       </ListItemColor>
                            //     </>

                            //   ))}
                            // </NukaCarousel>
                          )}
                        {/* {selectedColorName}   */}
                      </List>
                      <div
                        ref={navigationPrevRef}
                        style={{
                          position: "absolute",
                          width: "8em",
                          right: "8em",
                          height: "5em",
                          zIndex: "2",
                          backgroundColor: "transparent",
                          color: "transparent",
                        }}
                        onMouseEnter={() => {
                          startInterval("next");
                        }}
                        onMouseLeave={() => {
                          stopInterval();
                        }}
                      >
                        "Right"
                      </div>
                    </div>
                  )}

                {/* NUKA CAROUSEL WHICH IS GREATER THAN 16 slides FOR mobile phone  */}

                {selectedAttribute &&
                  selectedAttribute.options.length >= slidesToShow &&
                  width <= 400 && (
                    <div
                      className="mobileCarousel"
                      style={{
                        backgroundColor: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                        height: "14vh",
                        width: "90vw",
                        paddingLeft: "3em",
                      }}
                    >
                      <List
                        style={{ backgroundColor: "#fff", height: "117px" }}
                      >
                        {!selectedTrayPreviewOpenButton &&
                          selectedAttribute &&
                          !isTrayOpen && (
                            <Swiper
                              spaceBetween={5}
                              slidesPerView={2}
                              navigation={true}
                              modules={[Navigation]}
                            >
                              {selectedAttribute.options.map((option) => (
                                <>
                                  <SwiperSlide>
                                    <ListItemColor
                                      key={option.id}
                                      onClick={() => {
                                        selectOption(option.id);
                                      }}
                                      selected={option.selected}
                                      selectedColor={selectedColorName}
                                    >
                                      {option.imageUrl && (
                                        <ListItemImage
                                          src={option.imageUrl}
                                          onClick={() =>
                                            selectColorName(option.name)
                                          }
                                          selected={option.selected}
                                        />
                                      )}
                                    </ListItemColor>
                                  </SwiperSlide>
                                </>
                              ))}
                            </Swiper>
                          )}
                        {/* {selectedColorName}   */}
                      </List>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Selector;
