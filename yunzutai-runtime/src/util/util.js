//显示图表loading
export function showEchartLoading(myChart) {
  myChart.showLoading({
    text: "正在加载数据",
    color: "#377be4",
    textColor: "#377be4",
    maskColor: "rgba(0, 0, 0, 0.8)"
  });
}
//关闭图表loading
export function closeEchartLoading(myChart) {
  myChart.hideLoading();
}
