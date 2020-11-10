<template>
<div class="date-search">
    <div class="title" :style="labelStyle">{{ searchName || "查询条件" }}</div>
    <div class="block date">
        <el-date-picker v-model="beginTime" type="datetime" class="dateClass" clearable size="mini" placeholder="开始时间" :style="selectStyles" @change="beginChange" :append-to-body="false"></el-date-picker>
    </div>

    <div class="block date" v-show="showEndTime">
        <el-date-picker v-model="endTime" class="dateClass" type="datetime" clearable size="mini" placeholder="结束时间" :style="selectStyles" @change="endChange"></el-date-picker>
    </div>
    <template v-if="timeInterval && timeInterval.length > 0">
        <div class="title" :style="labelStyle" style="margin-left:20px">
            查询间隔
        </div>
        <div class="fast-select" style="width:112px">
            <el-select v-model="intervalValue" clearable class="dateClass" placeholder="请选择" size="mini" :style="selectStyles" @change="changeTimeInterval">
                <el-option v-for="item in timeInterval" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
    </template>
    <div class="options" :style="radioStyle">
        <label class="radio" v-show="dateTypes[0]" @click="selected('h')">
            <input type="radio" :checked="isChecked('h')" :name="'dateType' + randomName" class="inputNone" value="h" />
            <span :style="getRadioStyle('h')"></span>
            小时
        </label>
        <label class="radio" v-show="dateTypes[1]" @click="selected('d')">
            <input type="radio" :checked="isChecked('d')" :name="'dateType' + randomName" class="inputNone" value="d" />
            <span :style="getRadioStyle('d')"></span>日
        </label>
        <label class="radio" v-show="dateTypes[2]" @click="selected('w')">
            <input type="radio" :checked="isChecked('w')" :name="'dateType' + randomName" class="inputNone" value="w" />
            <span :style="getRadioStyle('w')"></span>周
        </label>
        <label class="radio" v-show="dateTypes[3]" @click="selected('M')">
            <input type="radio" :checked="isChecked('M')" :name="'dateType' + randomName" class="inputNone" value="M" />
            <span :style="getRadioStyle('M')"></span>月
        </label>
        <label class="radio" v-show="dateTypes[4]" @click="selected('q')">
            <input type="radio" :checked="isChecked('q')" :name="'dateType' + randomName" class="inputNone" value="q" />
            <span :style="getRadioStyle('q')"></span>季度
        </label>
        <label class="radio" v-show="dateTypes[5]" @click="selected('y')">
            <input type="radio" :checked="isChecked('y')" :name="'dateType' + randomName" class="inputNone" value="y" />
            <span :style="getRadioStyle('y')"></span>年
        </label>
    </div>
    <div class="fast-select" v-if="showFastSelect">
        <el-select v-model="fastSelectValue" clearable class="dateClass" placeholder="请选择" size="mini" :style="selectStyles" @change="fastSelectChange">
            <el-option v-for="item in fastSelectOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </div>
    <div class="block date" v-if="showSort">
        <el-select v-model="sortValue" clearable class="dateClass" placeholder="请选择" size="mini" :style="selectStyles" @change="sortChange">
            <el-option v-for="item in sortOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </div>
    <button class="btn" style="color:#fff" :style="btnStyle" @click="search">
        查询
    </button>
    <i class="el-icon-question" v-if="timeInterval && timeInterval.length > 0" @click="searchRules"></i>
</div>
</template>

<script>
import moment from "moment";
// import Validation from "@/util/formatDate"
export default {
    props: {
        theme: String,
        searchName: String,
        //dateSearch组件 config中必须包含的数据的格式：
        // {
        //   "查询条件字体": { "type": "fontSelect", "value": ["16px", "", ""] },
        //   "按钮颜色": { "type": "color-select", "value": "#3573c1" },
        //   "日期类型": {
        //     "type": "dateType",
        //     "values": [true, true, false, true, false, false],
        //     "label": ["小时", "日", "周", "月", "季度", "年"],
        //     "value": "h"
        //   }
        // }
        showSort: {
            type: Boolean,
            default: false
        },
        showtimeType: {
            type: Boolean,
            default: false
        },
        fastOptions: Array,
        timeInterval: Array,
        timeType: null,
        showEndTime: {
            type: Boolean,
            default: true
        },
        config: {
            type: Object
        }
    },
    data() {
        return {
            radioSelectStyles: {},
            btnStyle: {},
            radioStyle: {},
            selectStyles: {},
            labelStyle: {},
            dateTypes: [],
            beginTime: "",
            endTime: "",
            intervalUnit: "h",
            dateTime: null,
            showFastSelect: this.showtimeType,
            fastSelectOption: this.fastOptions || [{
                    value: 0,
                    label: "本日"
                },
                {
                    value: 1,
                    label: "本月"
                },
                {
                    value: 2,
                    label: "本季"
                },
                {
                    value: 3,
                    label: "本年"
                },
                {
                    value: 4,
                    label: "上日"
                },
                {
                    value: 5,
                    label: "上月"
                },
                {
                    value: 6,
                    label: "上季"
                },
                {
                    value: 7,
                    label: "上年"
                }
            ],
            fastSelectValue: null,
            sortOption: [{
                    value: 0,
                    label: "升序"
                },
                {
                    value: 1,
                    label: "降序"
                }
            ],
            sortValue: 0,
            searchIntervalValue: "1",
            randomName: Math.random(),
            intervalValue: "h"
        };
    },
    methods: {
        selected(value) {
            this.intervalUnit = value;
            let dateTypeConfig = this.config["日期类型"];
            if (dateTypeConfig) {
                dateTypeConfig.value = value;
            }
        },
        processStyles(config) {
            if (config) {
                let selectStyles = {};
                let radioStyle = {};
                let btnStyle = {};
                let labelStyle = {};
                let searchFontConfig = config["查询条件字体"];
                if (searchFontConfig) {
                    let searchFont = searchFontConfig.value;
                    if (searchFont) {
                        let fontSize = searchFont[0];
                        if (fontSize) {
                            selectStyles["fontSize"] = `${+fontSize.split("px")[0] - 4}px`;
                            btnStyle["fontSize"] = fontSize;
                            radioStyle["fontSize"] = fontSize;
                            labelStyle["fontSize"] = fontSize;
                        }

                        let fontFamily = searchFont[1];
                        if (fontFamily) {
                            selectStyles["fontFamily"] = fontFamily;
                            btnStyle["fontFamily"] = fontFamily;
                            radioStyle["fontFamily"] = fontFamily;
                            labelStyle["fontFamily"] = fontFamily;
                        }

                        let fontColor = searchFont[2];
                        if (fontColor) {
                            selectStyles["color"] = fontColor;
                            labelStyle["color"] = fontColor;
                            radioStyle["color"] = fontColor;
                        }
                    }
                }

                let dateTypesConfig = config["日期类型"];
                if (dateTypesConfig) {
                    let dateTypes = dateTypesConfig.values || [];
                    this.dateTypes = dateTypes;
                    this.intervalUnit = dateTypesConfig.value;
                    this.beginTime = dateTypesConfig.time[0] ?
                        new Date(dateTypesConfig.time[0]) :
                        "";
                    this.endTime = dateTypesConfig.time[1] ?
                        new Date(dateTypesConfig.time[1]) :
                        "";
                    this.showFastSelect = dateTypesConfig.fastSelect;
                }

                let btnColorConfig = config["按钮颜色"];
                if (btnColorConfig) {
                    let btnColor = btnColorConfig.value;
                    btnStyle.borderColor = btnColor;
                    btnStyle.backgroundColor = btnColor;
                    radioStyle.borderColor = btnColor;
                }
                this.labelStyle = labelStyle;
                this.btnStyle = btnStyle;
                this.selectStyles = selectStyles;
                this.radioStyle = radioStyle;
            }
        },
        isChecked(type) {
            return type === this.intervalUnit;
        },
        getRadioStyle(type) {
            let fontSize = this.radioStyle.fontSize ?
                +this.radioStyle.fontSize.split("px")[0] :
                16;
            let styles = {
                width: `${fontSize - 2}px`,
                height: `${fontSize - 2}px`
            };
            if (type === this.intervalUnit) {
                styles = {
                    borderWidth: `${0.3 * fontSize}px`,
                    width: `${0.4 * fontSize}px`,
                    height: `${0.4 * fontSize}px`,
                    borderColor: this.radioStyle.borderColor
                };
            }
            return styles;
        },
        search() {
            if (this.timeInterval && this.timeInterval.length > 0) {
                if (this.Validation(this.endTime - this.beginTime)) return;
            }
            this.$emit("search", {
                beginTime: moment(this.beginTime).format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
                intervalUnit: this.intervalUnit,
                intervalValue: Number(this.searchIntervalValue),
                timeType: this.timeType, //根据组件，判断是否要这个值
                sortValue: this.sortValue //根据组件，判断是否要这个值
            });
        },
        update(config) {
            this.processStyles(config);
        },
        fastSelectChange(val) {
            let today = new Date();
            let nowMonth = today.getMonth();
            let nowYear = today.getFullYear();
            let nowDay = today.getDay();
            switch (val) {
                //本日
                case 0:
                    this.beginTime = today;
                    this.endTime = today;
                    break;
                    //本月
                case 1:
                    this.beginTime = new Date(nowYear, nowMonth, 1);
                    this.endTime = today;
                    break;
                    //本季度
                case 2:
                    var startMonth = Math.floor(nowMonth / 3) * 3;
                    this.beginTime = new Date(nowYear, startMonth, 1);
                    this.endTime = today;
                    break;
                    //本年
                case 3:
                    this.beginTime = new Date(nowYear, 0, 1);
                    this.endTime = today;
                    break;
                    //上日
                case 4:
                    this.beginTime = new Date(nowYear, nowMonth, nowDay + 1, 0);
                    this.endTime = new Date(nowYear, nowMonth, nowDay + 2, 0);
                    break;
                    //上月
                case 5:
                    this.beginTime = new Date(nowYear, nowMonth - 1, 1);
                    this.endTime = new Date(nowYear, nowMonth, 0);
                    break;
                    //上季度
                case 6:
                    var startMonth1 = Math.floor(nowMonth / 3 - 1) * 3;
                    this.beginTime = new Date(nowYear, startMonth1, 1);
                    var endMonth1 = Math.floor(nowMonth / 3) * 3;
                    this.endTime = new Date(nowYear, endMonth1, 0);
                    break;
                    //上年
                case 7:
                    this.beginTime = new Date(nowYear - 1, 0, 1);
                    this.endTime = new Date(nowYear, 0, 0);
                    break;
            }
        },
        beginChange(val) {
            if (!this.config["日期类型"]?.time) return;
            this.config["日期类型"].time[0] = val;
        },
        endChange(val) {
            if (!this.config["日期类型"]?.time) return;
            this.config["日期类型"].time[1] = val;
        },
        // 选择时间间隔
        changeTimeInterval() {
            let intervalValue = this.intervalValue;
            if (
                intervalValue == "1" ||
                intervalValue == "2" ||
                intervalValue == "5" ||
                intervalValue == "10" ||
                intervalValue == "15" ||
                intervalValue == "30"
            ) {
                this.intervalUnit = "m";
                this.searchIntervalValue = intervalValue;
            } else {
                this.intervalUnit = intervalValue;
                this.searchIntervalValue = "1";
            }
        },
        // 查询规则
        searchRules() {
            if (!this.$store.state.runtime) return;
            let intervalValue = this.intervalValue;
            let message = "时间不限制!";
            switch (intervalValue) {
                case "1":
                    message = "按照起始时间6个小时之内可查询!";
                    break;
                case "2":
                    message = "按照起始时间12个小时之内可查询!";
                    break;
                case "5":
                    message = "按照起始时间24个小时之内可查询!";
                    break;
                case "10":
                    message = "按照起始时间2天之内可查询!";
                    break;
                case "15":
                    message = "按照起始时间3天之内可查询!";
                    break;
                case "30":
                    message = "按照起始时间6天之内可查询!";
                    break;
                case "h":
                    message = "按照起始时间20天之内可查询!";
                    break;
                case "d":
                    message = "按照起始时间1年之内可查询!";
                    break;
                case "w":
                    message = "按照起始时间4年之内可查询!";
                    break;
                default:
                    break;
            }
            this.showMessege(message);
        },
        showMessege(message) {
            this.$message({
                message: message,
                type: "warning",
                duration: 1000,
                showClose: false
            });
        },
        Validation(time) {
            let hours = 60 * 60 * 1000;
            let isLock = false;
            let intervalValue = this.intervalValue;
            if (time <= 0) {
                this.$message({
                    message: "起始时间不能早于或等于结束时间",
                    type: "error",
                    duration: 1000,
                    showClose: false
                });
                return true;
            }
            if (intervalValue == "1") {
                if (time <= hours * 6) {
                    isLock = true;
                }
            } else if (intervalValue == "2") {
                if (time <= hours * 12) {
                    isLock = true;
                }
            } else if (intervalValue == "5") {
                if (time <= hours * 24) {
                    isLock = true;
                }
            } else if (intervalValue == "10") {
                if (time <= hours * 24 * 2) {
                    isLock = true;
                }
            } else if (intervalValue == "15") {
                if (time <= hours * 24 * 3) {
                    isLock = true;
                }
            } else if (intervalValue == "30") {
                if (time <= hours * 24 * 6) {
                    isLock = true;
                }
            } else if (intervalValue == "h") {
                if (time <= hours * 24 * 20) {
                    isLock = true;
                }
            } else if (intervalValue == "d") {
                if (time <= hours * 24 * 366) {
                    isLock = true;
                }
            } else if (intervalValue == "w") {
                if (time <= hours * 24 * 366 * 4) {
                    isLock = true;
                }
            } else if (intervalValue == "M") {
                isLock = true;
            } else if (intervalValue == "q") {
                isLock = true;
            } else if (intervalValue == "y") {
                isLock = true;
            }
            if (!isLock) {
                let message = "不符合条件查询，请查看帮助信息";
                this.showMessege(message);
                return true;
            }
            return false;
        }
    }
};
</script>

<style lang="less" scoped>
.date-search {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    align-items: center;
    white-space: nowrap;

    .inputNone {
        display: none;
    }

    .title {
        font-weight: 400;
    }

    .btn {
        outline: none;
        cursor: pointer;
        padding: 4px 15px;
        border: none;
        min-width: 58px;
        min-height: 28px;
        border-radius: 4px;
        box-sizing: border-box;
        color: #b2ddff;
        background-color: #3573c1;
        margin-left: 10px;
    }

    .radio {
        span {
            cursor: pointer;
            display: inline-block;
            width: 12px;
            height: 12px;
            vertical-align: middle;
            border-radius: 50%;
            margin: 0 6px;
            // box-sizing: content-box;
            border: 1px solid #404753;
        }

        [type="radio"]:checked+span {
            background-color: #b2ddff;
        }
    }

    .dateClass {
        font-size: 12px;
        width: auto;
        max-width: 162px;
        margin-left: 10px;
    }

    .options {
        margin: 0 20px;
        display: inline-block;
    }

    .block.date {
        // width: calc();
    }

    .fast-select {
        margin-right: 10px;
    }
}

.el-icon-question {
    color: #b2ddff;
}

.el-icon-question {
    font-size: 26px;
    margin-left: 10px;
}

/deep/ .el-picker-panel.el-date-picker.el-popper {
    left: unset !important;
    top: unset !important;
}
</style>
