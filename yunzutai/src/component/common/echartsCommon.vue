<template>
  <div class="echarts-container">
    <div class="charts" ref="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["chartTitle", "series", "config", "xAxis"],
  data() {
    return {
      title: "组合曲线图",
      cacheSeries: {
        line: [],
        bar: []
      }
    };
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
  },
  watch: {
    "config.尺寸.value"() {
      this.chart.resize();
    }
  },
  methods: {
    processConfig(config, series, selectedLegends) {
      if (config) {
        let titleData = {};
        let contentData = {};
        let titleConfig = config["标题"];
        if (titleConfig) {
          titleData.title = titleConfig.value;
        }
        let titleFontConfig = config["标题字体"];
        if (titleFontConfig) {
          let titleFont = titleFontConfig.value;
          titleData.fontSize = titleFont[0];
          titleData.fontFamily = titleFont[1];
          titleData.color = titleFont[2];
        }
        let contentFontConfig = config["内容字体"];
        if (contentFontConfig) {
          let contentFont = contentFontConfig.value;
          contentData.fontSize = contentFont[0];
          contentData.fontFamily = contentFont[1];
          contentData.color = contentFont[2];
        }

        let coordinateConfig = config["坐标设置"];
        if (coordinateConfig) {
          contentData.coorType = coordinateConfig.value;
          let options = coordinateConfig.options;
          if (options && options.length) {
            contentData.options = options.map(opts => {
              return opts.map(opt => {
                return opt.value;
              });
            });
          }
        }
        this.changeOption(titleData, contentData, series, selectedLegends);
      }
    },
    changeOption(titleData, contentData, series, selectedLegends) {
      let option = {
        title: {
          text: titleData.title,
          textStyle: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontFamily: titleData.fontFamily,
            fontSize: titleData.fontSize.split("px")[0],
            color: titleData.color
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },

        legend: {
          data: series.map(se => {
            return se.name;
          }),
          textStyle: {
            fontSize: contentData.fontSize,
            fontFamily: contentData.fontFamily,
            color: contentData.color
          }
        },
        grid: {
          left: "2%",
          right: "3%",
          bottom: "2%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              textStyle: {
                fontSize: contentData.fontSize.split("px")[0],
                fontFamily: contentData.fontFamily,
                color: contentData.color
              }
            },
            data: this.xAxis,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: this.getYAxis(contentData, series),
        series
      };
      if (selectedLegends) {
        option.legend.selected = selectedLegends;
      }
      this.chart.setOption(option, true);
      //   this.chart.resize({
      //     width: `${this.$el.children[0].clientWidth}px`,
      //     height: `${this.$el.children[0].clientHeight}px`
      //   });
    },

    getYAxis(contentData, series) {
      let dAxis = {
        type: "value",
        axisLabel: {
          textStyle: {
            fontSize: contentData.fontSize.split("px")[0],
            fontFamily: contentData.fontFamily,
            color: contentData.color
          }
        },
        nameTextStyle: {
          fontSize: contentData.fontSize.split("px")[0],
          fontFamily: contentData.fontFamily,
          color: contentData.color
        }
      };
      let yAxis = contentData.options.map((opts, index) => {
        let copyAxis = { ...dAxis };
        copyAxis.name = `单位(${opts[2]})`;
        if (contentData.coorType === 0) {
          copyAxis.min = opts[0];
          copyAxis.max = opts[1];
        } else {
          let { min, max } = this._getMinMax(series, index);
          copyAxis.min = min;
          copyAxis.max = max;
        }
        copyAxis.splitNumber = 5;
        copyAxis.interval =
          (copyAxis.max - copyAxis.min) / copyAxis.splitNumber;
        if (index > 1) {
          copyAxis.offset = 40;
          copyAxis.name = opts[2];
          copyAxis.namePosistion;
        }
        return copyAxis;
      });
      return yAxis;
    },
    _getMinMax(series, index) {
      let matchedSeries = series.filter(se => {
        return se.yAxisIndex === index;
      });
      //获取不用叠加的series
      let unStackedSeries = matchedSeries.filter(mse => {
        return !mse.stack;
      });
      let stackedSeries = matchedSeries.filter(mse => {
        return mse.stack;
      });

      let { umin, umax } = this._getUnstackedMinMax(unStackedSeries);

      let { smin, smax } = this._getStackedMinMax(stackedSeries);

      let min = Math.min(umin, smin);
      let max = Math.max(umax, smax);
      let offsetMin = 0,
        offsetMax = 0.1;
      let delta = max - min;
      min = Math.floor(min - delta * offsetMin);
      max = Math.round(max + delta * offsetMax);
      let hasBar =
        matchedSeries.filter(se => {
          return se.type === "bar";
        }).length > 0;
      if (hasBar) {
        min = 0;
      }

      return { min, max };
    },
    _getStackedMinMax(series) {
      let smin = Number.MAX_VALUE,
        smax = Number.MIN_VALUE;
      let xAxis = this.xAxis;
      let stacks = [];
      series.forEach(se => {
        let stack = se.stack;
        if (stacks.indexOf(stack) === -1) {
          stacks.push(stack);
        }
      });
      stacks.forEach(st => {
        let sSeries = series.filter(se => {
          return se.stack === st;
        });
        let plusData = [];
        xAxis.forEach((xa, index) => {
          if (xa) {
            let indexPlusData = 0;
            sSeries.forEach(sse => {
              indexPlusData += sse.data[index];
            });
            plusData.push(indexPlusData);
          }
        });
        smin = Math.min(smin, ...plusData);
        smax = Math.max(smax, ...plusData);
      });
      return { smin, smax };
    },
    _getUnstackedMinMax(series) {
      let umin = Number.MAX_VALUE,
        umax = Number.MIN_VALUE;
      series.forEach(se => {
        umin = Math.min(umin, ...se.data);
        umax = Math.max(umax, ...se.data);
      });
      return { umin, umax };
    },
    update(config, hconfig, series, selectedLegends) {
      if (!series) {
        series = this._getSeries(config, hconfig);
      }
      this.processConfig(config, series, selectedLegends);
    },
    _getSeries(bconfig, hconfig) {
      let mockSeries = [];

      for (var p in hconfig) {
        if (p.indexOf("数据源") > -1) {
          let conf = hconfig[p];
          let seriesConf = conf.value;
          // let count = 0;
          seriesConf.forEach(sc => {
            let seriesColor = sc.itemStyle.normal.color;
            let series = this.cacheSeries[sc.name];
            let index = sc.index;
            if (!series) {
              series = {
                name: sc.name,
                type: conf.chartType,
                smooth: true,
                yAxisIndex: index,
                data: this._genSeriesData(index, bconfig),
                itemStyle: {
                  normal: {
                    color: seriesColor
                  }
                }
              };
              if (sc.stack) {
                series.stack = sc.stack;
              }
              this.cacheSeries[sc.name] = series;
            } else {
              series.name = sc.name;
              series.itemStyle.normal.color = seriesColor;
            }
            mockSeries.push(series);
            // count++;
          });
        }
      }
      return mockSeries;
    },
    _genSeriesData(index, config) {
      let corOptions = config["坐标设置"].options;
      let opt = corOptions[index];
      let min = opt[0].value;
      let max = opt[1].value;
      let delta = max - min;
      let xAxis = this.xAxis;
      let len = xAxis.length;
      let datas = [];
      for (let i = 0; i < len; i++) {
        let data = min + Number((Math.random() * delta).toFixed(2));
        datas.push(data);
      }
      return datas;
    }
  }
};
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 100%;
}
.charts {
  width: 100%;
  height: 100%;
}
</style>
