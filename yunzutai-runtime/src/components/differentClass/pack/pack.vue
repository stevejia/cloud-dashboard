<template>
  <div class="comps">
    <template v-for="(item, title) in config">
      <template v-if="item.type === 'input'">
        <packInput
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packInput>
      </template>
      <template v-else-if="item.type === 'select'">
        <packSelect
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packSelect>
      </template>
      <template v-else-if="item.type === 'resetStyle'">
        <packResetStyle
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packResetStyle>
      </template>
      <template v-else-if="item.type === 'fontStyle'">
        <packFontStyle
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontStyle>
      </template>
      <template v-else-if="item.type === 'inputFontStyle'">
        <packInputFontStyle
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packInputFontStyle>
      </template>
      <template v-else-if="item.type === 'shadowStyle'">
        <packShadowStyle
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packShadowStyle>
      </template>
      <template v-else-if="item.type === 'logo'">
        <packLogo
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packLogo>
      </template>
      <template v-else-if="item.type === 'color-select'">
        <packColorSelect
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packColorSelect>
      </template>
      <template v-else-if="item.type === 'checkbox'">
        <packCheckbox
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packCheckbox>
      </template>
      <template v-else-if="item.type === 'sky'">
        <packSky
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packSky>
      </template>
      <template v-else-if="item.type === 'linear-gradient'">
        <packLinearGradient
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packLinearGradient>
      </template>
      <template v-else-if="item.type === 'widthHeight'">
        <packWidthHeight
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packWidthHeight>
      </template>
      <template v-else-if="item.type === 'slider'">
        <packSlider
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packSlider>
      </template>
      <template v-else-if="item.type === 'textarea'">
        <packTextarea
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packTextarea>
      </template>
      <template v-else-if="item.type === 'font'">
        <packFont
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFont>
      </template>
      <template v-else-if="item.type === 'font-align'">
        <packFontAlign
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontAlign>
      </template>
      <template v-else-if="item.type === 'slider-gradient'">
        <packSliderGradient
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packSliderGradient>
      </template>
      <template v-else-if="item.type === 'explain'">
        <packExplain
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packExplain>
      </template>
      <template v-else-if="item.type === 'eventOpacity'">
        <packEventOpacity
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEventOpacity>
      </template>
      <template v-else-if="item.type === 'eventVisible'">
        <packEventVisible
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEventVisible>
      </template>
      <template v-else-if="item.type === 'eventColor'">
        <packEventColor
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEventColor>
      </template>
      <template v-else-if="item.type === 'eventColorChange'">
        <packEventColorChange
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEventColorChange>
      </template>
      <template v-else-if="item.type === 'event'">
        <packEvent
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEvent>
      </template>
      <template v-else-if="item.type === 'line'">
        <packLine
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packLine>
      </template>
      <template v-else-if="item.type === 'deciaml'">
        <packDeciaml
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDeciaml>
      </template>
      <template v-else-if="item.type === 'mul-checkbox'">
        <packMulCheckbox
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packMulCheckbox>
      </template>
      <template v-else-if="item.type === 'upload-image'">
        <packUploadImage
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packUploadImage>
      </template>
      <template v-else-if="item.type === 'degree'">
        <packDegree
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDegree>
      </template>
      <template v-else-if="item.type === 'iconCheckbox'">
        <packIconCheckbox
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packIconCheckbox>
      </template>
      <template v-else-if="item.type === 'container'">
        <packContainer
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packContainer>
      </template>
      <template v-else-if="item.type === 'dateTypeCheckbox'">
        <packDateTypeCheckbox
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDateTypeCheckbox>
      </template>
      <template v-else-if="item.type === 'eventMap'">
        <packEventMap
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEventMap>
      </template>
      <template v-else-if="item.type === 'seriesData'">
        <packSeriesData
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packSeriesData>
      </template>
      <template v-else-if="item.type === 'fontThree'">
        <packFontThree
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontThree>
      </template>
      <template v-else-if="item.type === 'fontSelect'">
        <packFontSelect
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontSelect>
      </template>
      <template v-else-if="item.type === 'treeConfig'">
        <packTreeConfig
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packTreeConfig>
      </template>
      <template v-else-if="item.type === 'dependDateSelect'">
        <packDependDateSelect
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDependDateSelect>
      </template>
      <template v-else-if="item.type === 'dependtree'">
        <packDependtree
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDependtree>
      </template>
      <template v-else-if="item.type === 'dateType'">
        <packDateType
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDateType>
      </template>
      <template v-else-if="item.type === 'pieNestedSeries'">
        <packPieNestedSeries
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packPieNestedSeries>
      </template>
      <template v-else-if="item.type === 'coordinate'">
        <packCoordinate
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packCoordinate>
      </template>
      <template v-else-if="item.type === 'composeSeriesData'">
        <packComposeSeriesData
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packComposeSeriesData>
      </template>
      <template v-else-if="item.type === 'composeSeriesData2'">
        <packComposeSeriesData2
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packComposeSeriesData2>
      </template>
      <template v-else-if="item.type === 'composeSeriesData3'">
        <packComposeSeriesData3
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packComposeSeriesData3>
      </template>
      <template v-else-if="item.type === 'mulInput'">
        <packMulInput
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packMulInput>
      </template>
      <template v-else-if="item.type === 'checkboxFold'">
        <packCheckboxFold
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packCheckboxFold>
      </template>
      <template v-else-if="item.type === 'containerSelect'">
        <packContainerSelect
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packContainerSelect>
      </template>
      <template v-else-if="item.type === 'btnRotate'">
        <packBtnRotate
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packBtnRotate>
      </template>
      <template v-else-if="item.type === 'fontAbleSet'">
        <packFontAbleSet
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontAbleSet>
      </template>
      <template v-else-if="item.type === 'fontThrees'">
        <packFontThrees
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontThrees>
      </template>
      <template v-else-if="item.type === 'inputNumber'">
        <packInputNumber
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packInputNumber>
      </template>
      <template v-else-if="item.type === 'dataTree'">
        <packDataTree
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDataTree>
      </template>
      <template v-else-if="item.type === 'numRange'">
        <packNumRange
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packNumRange>
      </template>
      <template v-else-if="item.type === 'numRanges'">
        <packNumRanges
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packNumRanges>
      </template>
      <template v-else-if="item.type === 'fontFour'">
        <packFontFour
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontFour>
      </template>
      <template v-else-if="item.type === 'energy'">
        <packEnergy
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEnergy>
      </template>
      <!-- <template v-else-if="item.type === 'scatter'">
        <pack-scatter
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></pack-scatter>
      </template>-->
      <template v-else-if="item.type === 'zoom'">
        <packZoom
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packZoom>
      </template>
      <template v-else-if="item.type === 'writeable'">
        <packWriteable
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packWriteable>
      </template>
      <template v-else-if="item.type === 'eventBtn'">
        <packEventBtn
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEventBtn>
      </template>
      <template v-else-if="item.type === 'modeToggle'">
        <packModeToggle
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packModeToggle>
      </template>
      <template v-else-if="item.type === 'pieSelectDate'">
        <packPieSelectDate
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packPieSelectDate>
      </template>
      <template v-else-if="item.type === 'fontResponse'">
        <packFontResponse
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packFontResponse>
      </template>
      <template v-else-if="item.type === 'dataTreeLinkage'">
        <packDataTreeLinkage
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packDataTreeLinkage>
      </template>
      <template v-else-if="item.type === 'twoInput'">
        <packTwoInput
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packTwoInput>
      </template>
      <template v-else-if="item.type === 'color-select-row'">
        <packColorSelectRow
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packColorSelectRow>
      </template>
      <template v-else-if="item.type === 'eventMapNumber'">
        <packEventMapNumber
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packEventMapNumber>
      </template>
      <template v-else-if="item.type === 'mode-background'">
        <packModeBackground
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packModeBackground>
      </template>
      <template v-else-if="item.type === 'text'">
        <packText
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packText>
      </template>
      <template v-else-if="item.type === 'progressListConfig'">
        <packProgressList
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packProgressList>
      </template>
      <template v-else-if="item.type === 'coordinateMap'">
        <packCoordinateMap
          :title="title"
          :config="item"
          :key="title"
          :onChange="changes"
        ></packCoordinateMap>
      </template>
    </template>
  </div>
</template>

<script>
const packInput = () => import("./input.vue");
const packSelect = () => import("./select.vue");
const packCoordinate = () => import("./coordinate.vue");
const packResetStyle = () => import("./resetStyle.vue");
const packFontStyle = () => import("./fontStyle.vue");
const packInputFontStyle = () => import("./inputFontStyle.vue");
const packShadowStyle = () => import("./shadowStyle.vue");
const packLogo = () => import("./logo.vue");
const packColorSelect = () => import("./colorSelect.vue");
const packCheckbox = () => import("./checkbox.vue");
const packSky = () => import("./sky.vue");
const packLinearGradient = () => import("./linearGradient.vue");
const packWidthHeight = () => import("./widthHeight.vue");
const packSlider = () => import("./slider.vue");
const packTextarea = () => import("./textarea.vue");
const packFontAlign = () => import("./fontAlign.vue");
const packFont = () => import("./font.vue");
const packSliderGradient = () => import("./sliderGradient.vue");
const packExplain = () => import("./explain.vue");
const packEventVisible = () => import("./eventVisible.vue");
const packEventOpacity = () => import("./eventOpacity.vue");
const packEventColor = () => import("./eventColor.vue");
const packEventColorChange = () => import("./eventColorChange.vue");
const packEvent = () => import("./event.vue");
const packLine = () => import("./line.vue");
const packDeciaml = () => import("./deciaml.vue");
const packMulCheckbox = () => import("./mulCheckbox.vue");
const packUploadImage = () => import("./uploadImage.vue");
const packDegree = () => import("./degree.vue");
const packIconCheckbox = () => import("./iconCheckbox.vue");
const packDateTypeCheckbox = () => import("./dateTypeCheckbox.vue");
const packSeriesData = () => import("./seriesData.vue");
const packContainer = () => import("./containers.vue");
const packEventMap = () => import("./eventMap.vue");
const packFontThree = () => import("./fontThree.vue");
const packFontAbleSet = () => import("./fontAbleSet.vue");
const packFontSelect = () => import("./fontSelect.vue");
const packTreeConfig = () => import("./treeConfig.vue");
const packDependtree = () => import("./dependtree.vue");
const packDependDateSelect = () => import("./dependDateSelect.vue");
const packDateType = () => import("./dateType.vue");
const packComposeSeriesData = () => import("./composeSeriesData.vue");
const packComposeSeriesData2 = () => import("./composeSeriesData2.vue");
const packComposeSeriesData3 = () => import("./composeSeriesData3.vue");
const packPieNestedSeries = () => import("./pieNestedSeries.vue");
const packMulInput = () => import("./mulInput.vue");
const packCheckboxFold = () => import("./checkboxFold.vue");
const packContainerSelect = () => import("./containerSelect.vue");
const packBtnRotate = () => import("./btnRotate.vue");
const packNumRange = () => import("./numRange.vue");
const packEnergy = () => import("./energy.vue");
const packFontFour = () => import("./fontFour.vue");
const packFontThrees = () => import("./fontThrees.vue");
const packInputNumber = () => import("./inputNumber.vue");
const packDataTree = () => import("./dataTree.vue");
const packZoom = () => import("./zoom.vue");
// const packScatter = () => import("./scatter.vue");
const packWriteable = () => import("./writeable.vue");
const packModeToggle = () => import("./modeToggle.vue");
const packPieSelectDate = () => import("./pieSelectDate.vue");

const packNumRanges = () => import("./numRanges.vue");
const packEventBtn = () => import("./eventBtn.vue");
const packFontResponse = () => import("./fontResponse.vue");
const packDataTreeLinkage = () => import("./dataTreeLinkage.vue");
const packTwoInput = () => import("./twoInput.vue");
const packColorSelectRow = () => import("./colorSelectRow.vue");
const packEventMapNumber = () => import("./eventMapNumber.vue");
const packModeBackground = () => import("./modeBackground.vue");
const packText = () => import("./text.vue");
const packProgressList = () => import("./progressListConfig.vue");
const packCoordinateMap = () => import("./coordinateMap.vue");
export default {
  components: {
    packFontResponse,
    packEventBtn,
    packZoom,
    packInputNumber,
    packFontThrees,
    packBtnRotate,
    packContainerSelect,
    packCheckboxFold,
    packDateType,
    packDependtree,
    packDependDateSelect,
    packTreeConfig,
    packFontSelect,
    packFontThree,
    packInput,
    packSelect,
    packResetStyle,
    packFontStyle,
    packInputFontStyle,
    packShadowStyle,
    packLogo,
    packColorSelect,
    packCheckbox,
    packSky,
    packLinearGradient,
    packWidthHeight,
    packSlider,
    packTextarea,
    packFontAlign,
    packFont,
    packSliderGradient,
    packExplain,
    packEventVisible,
    packEventOpacity,
    packEventColor,
    packEventColorChange,
    packEvent,
    packLine,
    packDeciaml,
    packMulCheckbox,
    packUploadImage,
    packDegree,
    packIconCheckbox,
    packDateTypeCheckbox,
    packSeriesData,
    packContainer,
    packEventMap,
    packComposeSeriesData,
    packComposeSeriesData2,
    packComposeSeriesData3,
    packPieNestedSeries,
    packMulInput,
    packCoordinate,
    packFontAbleSet,
    packDataTree,
    packNumRange,
    packEnergy,
    packFontFour,
    // packScatter,
    packWriteable,
    packNumRanges,
    packModeToggle,
    packPieSelectDate,
    packDataTreeLinkage,
    packColorSelectRow,
    packEventMapNumber,
    packTwoInput,
    packModeBackground,
    packText,
    packProgressList,
    packCoordinateMap
  },
  props: {
    type: String || Object,
    config: Object,
    onChange: Function
  },
  methods: {
    changes(order, finalChange) {
      //如果finalChange 那么表明需要属性栏最近的一次变化 例如 blur select change 事件 等等
      if (finalChange) {
        console.log("record history");
        let $history = this.$drag?.$history;
        let type = this.type;
        let currentType = this.$parent.currentType;
        if ((type || currentType) && $history) {
          let operation = this.getOperation(type);
          if (!operation) {
            operation =
              //1 for basic config 2 for high config
              currentType === "basic" ? 1 : currentType === "high" ? 2 : null;
          }
          if (operation) {
            this.$nextTick(() => {
              $history.setHistory(operation);
            });
          }
        }
      }
      // console.log(this);
      // let operation = this.getOperation(this.type);
      // this.type &&
      //   this.$drag &&
      //   this.$drag.$history &&
      //   this.$drag.$history.setHistory(operation, { ...this.config });
      this.onChange(this.type, order);
    },
    getOperation(type) {
      switch (type) {
        case "theme":
          return 4;
        case "top":
          return 5;
        case "center":
          return 6;
        case "left":
          return 7;
        case "user":
          return 8;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.comps {
  padding: 5px;
  > div {
    padding: 0 0 15px 0;
    /deep/ .title {
      position: relative;
      padding-bottom: 5px;
      .el-checkbox {
        padding-right: 10px;
      }
    }
  }
  & /deep/ .el-input__inner {
    height: 28px;
    line-height: 28px;
    color: #282828;
  }
  & /deep/ .el-input__icon {
    line-height: 28px;
  }
  & /deep/ .el-checkbox {
    color: white;
  }
  & /deep/ .el-color-picker {
    height: 28px;
  }
  & /deep/ .el-color-picker__trigger {
    border: none;
    padding: 0px;
    width: 28px;
    height: 28px;
    border-radius: 4px;
  }
  & /deep/ .el-input-number__decrease {
    display: none;
  }
  & /deep/ .el-input-number__increase {
    display: none;
  }
  & /deep/ .compsInput {
    width: 48px;
    outline: none;
    font-family: microsoft yahei;
    font-size: 14px;
    text-align: left;
    padding-left: 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 30px;
    color: #282828;
    background-color: #fff;
    border: 1px solid #282828;
    border-radius: 4px;
  }
  & /deep/ .el-slider__input {
    width: 50px;
    .el-input__inner {
      padding: 0;
    }
  }
  & /deep/ .el-slider__runway.show-input {
    width: calc(100% - 70px);
  }
  & /deep/ .body {
    display: flex;
    flex-direction: row;
    align-items: center;
    .el-slider {
      width: calc(100%);
      padding: 0 10px;
    }
    .demonstration {
      text-align: center;
      width: calc(20%);
    }
  }
}
</style>
