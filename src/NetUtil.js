/**
 * Created by hongty on 2016/11/15.
 */
let NetUtil = {
  postJson(url, callback){
    // let debugUrl = `${url}&v=sandbox`;
    let debugUrl = `${url}`;
    // console.log('debugUrl is ',debugUrl)
    fetch(debugUrl, callback)
      .then((response) => response.text())
      .then((responseText) => {
        //  callback(JSON.parse(responseText));
        callback(responseText);
      })
      .catch((err)=> {
        console.error(err);
        alert("网络错误，请稍后重试");
      }).done();
  },

// postJson(url, data, callback){
//     var fetchOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'multipart/form-data;boundary=6ff46e0b6b5148d984f148b6542e5a5d'
//         },
//         body: data
//     };
//     var curdata = {
//         data: fetchOptions.body
//     }
//     alert(curdata.data);
//
//     fetch(url, curdata)
//         .then((response) => response.text())
//         .then((responseText) => {
//             //  callback(JSON.parse(responseText));
//             callback(responseText);
//         }).done();
// },
}
export default NetUtil;