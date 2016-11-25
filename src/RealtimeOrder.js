/**
 * Created by hongty on 2016/11/14.
 */
/**
 * Created by hongty on 2016/11/14.
 */
import React, {Component} from 'react';
import  {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  AsyncStorage,
} from 'react-native';
import NetUtil from './NetUtil';
import OrderListView from './OrderListView';
var Token;

export default class getFlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialChecked: false,
      totalChecked: 0,
      detailDataLoaded: false,
      detailData: null,
      noFlighting: false,

      orderCreateTime: '',
      OSTime: '',
      orderArrivalTime: '',

      buttonStatus: false,
    }
  }

  componentDidMount() {
    let _this = this;
    AsyncStorage.getItem("LOGIN_TOKEN", function (errs, result) {
      //TODO:错误处理
      if (!errs) {
        // let Token = result;
        Token = result;
        console.log("取得缓存中的Token是  ", Token, "  ");
      }
    });
    AsyncStorage.getItem("DETAIL_ID", function (errs, result) {
      //TODO:错误处理
      if (!errs) {
        let curfid = result;
        _this.getOrderDetail(curfid);
        console.log("取得缓存中的order_detail_id是  ", curfid, "  ");
      }
    });
  }

  getOrderDetail(id) {
    let _this = this;
    let curId = id;
    let url = "http://jieyan.xyitech.com/order/detail?token=" + Token + "&id=" + curId;
    NetUtil.postJson(url, (responseText)=> {
      let curdata = JSON.parse(responseText);
      console.log('取得的运单详情是 ', curdata);
      if (curdata.err == '0') {
        _this.setState({
          detailDataLoaded: true,
          detailData: curdata,

          durationValue: (curdata.order.route.route.duration / 60).toFixed(0),
          distanceValue: (curdata.order.route.route.distance / 1000).toFixed(0),
        });
        if (curdata.order.state == '0') {
          this.setState({
            noFlighting: true,
          })
        } else {
          _this.timeCount(curdata);
        }
      } else {
        // alert("用户名或密码错误，请重试");
      }
    });
  }

  // 运单倒计时
  timeCount(data) {
    let curdata = data;
    console.log("倒计时取得数据是", curdata);
    let orderCreateTime = curdata.order['t2'];
    let duration = this.state.detailData.order.route.route.duration;
    let distance = this.state.detailData.order.route.route.distance;
    let rate = (distance / 1000) / (duration / 60);
    let orderArrivalTime = curdata.order['t2'] + duration;
    let OSTime = curdata.osTime;

    let restTime = orderArrivalTime - OSTime;

    this.setState({
      orderCreateTime: curdata.order['t2'],
      OSTime: curdata.osTime,
      orderArrivalTime: curdata.order['t2'] + duration,

      orderRestTime: restTime,
    });
    console.log("飞机起飞时间s ", orderCreateTime, "  预计飞行时间s ", duration, "  预计到达时间s ", orderArrivalTime, "  服务器返回时间s  ", OSTime, "  剩余时间是  ", restTime);
    this.timer = setInterval(()=> {
      this.setState({
        durationValue: (restTime / 60).toFixed(0),
        distanceValue: (restTime / 60) * rate.toFixed(0),
      });
      // this.orderInterval();
      console.log('A：来来来，和我一起倒计时~~~B：你给我滚！');
      if (restTime <= 0) {
        console.log('A：时间小于0啊！B：你个二货');
        this.setState({
          durationValue: 0,
          distanceValue: 0,
          buttonStatus: true,
        });
        clearInterval(this.timer);
      } else {
        restTime--;
        console.log('A：时光匆匆匆匆流走，也也也不回头！');
        if (restTime % 60 == 0) {
          console.log('A：时间可以整除啦！B：然后呢？');
          this.setState({
            durationValue: (restTime / 60).toFixed(0),
            distanceValue: (restTime / 60) * rate.toFixed(0),
          })
        }
      }
    }, 1000);

  }

  // orderInterval(time, rate) {
  //   let curcounttime = time;
  //   let currate = rate;
  //
  //
  // }

// 判断运单状态
  orderState(state) {
    let n = state;
    // alert(n)
    // console.log('运单当前状态是 ', n);
    switch (n) {
      case 0:
        return '未起飞';
        break;
      case 1:
        return '已取消';
        break;
      case 2:
        return '运送中';
        break;
      case 3 || 6 || 9:
        return '异常';
        break;
      case 4:
        return '已送达';
        break;
      case 5:
        return '返航中';
        break;
      case 7:
        return '完成';
        break;
      case 8:
        return '返航中';
        break;
      default:
        return '';
    }
  }

  // 运单时间转换
  setOrderStatusDateTime(value, type) {
    let item = this.state.detailData.order;
    let curtimestate = value;
    var curTime = item['' + curtimestate];
    console.log('当前时间是 ', curTime, '  运单t是  ', curtimestate);
    let unixtime = curTime * 1;
    let unixTimestamp = new Date(unixtime * 1000 + 28800000);//东8区时间偏移量为28800000毫秒
    let commonTime = unixTimestamp;
    let nYear = commonTime.getUTCFullYear();
    let nMonth = (commonTime.getUTCMonth() + 1);
    nMonth = nMonth < 10 ? ('0' + nMonth) : nMonth;
    let nDay = commonTime.getUTCDate();
    nDay = nDay < 10 ? ('0' + nDay) : nDay;

    let tDate = nYear + "." + nMonth + "." + nDay;

    let nHour = (commonTime.getUTCHours());
    nHour = nHour < 10 ? ('0' + nHour) : nHour;
    let nMinutes = commonTime.getUTCMinutes();
    nMinutes = nMinutes < 10 ? ('0' + nMinutes) : nMinutes;
    let nSeconds = commonTime.getUTCSeconds();
    nSeconds = nSeconds < 10 ? ('0' + nSeconds) : nSeconds;

    let tTime = nHour + ":" + nMinutes;

    // let newStatusDate = nYear + "/" + nMonth + "/" + nDay + "/" + nHour + ":" + nMinutes + ":" + nSeconds;
    if (type == "date") {
      return nYear + "." + nMonth + "." + nDay;
    } else {
      return nHour + ":" + nMinutes;
    }
  }

  _openPage() {
    if (this.state.totalChecked == 4) {
      alert('飞机起飞');
    } else {
      alert('你想飞？必须全部点中哦😯！');
    }
    // this.props.navigator.push({
    //     title: 'LeftMenuList',
    //     component: LeftMenuList
    // })
  }

  pageJump() {
    this.props.navigator.push({
      // title: '',
      name: 'OrderListView',
      component: OrderListView
    });
  }

  orderConfirm() {
    if (this.state.buttonStatus) {
      let _this = this;
      let curId = this.state.detailData.order.id;
      let url = "http://jieyan.xyitech.com/order/update?token=" + Token + "&id=" + curId + "&state=4";
      NetUtil.postJson(url, (responseText)=> {
        let curdata = JSON.parse(responseText);
        console.log('发送指令返回数据 ', curdata);
        if (curdata.err == '0') {
          this.pageJump();
        } else {
          Alert.alert(
            '温馨提示',
            '无法确认收货，请联系客服！',
            [
              {text: '确定',}
            ]
          );
          // alert("起飞失败，请重试，或联系客服！");
        }
      })
    }
    else {
      alert("暂时无法确认，请稍后重试！")
    }
  }


  render() {
    console.disableYellowBox = true;
    console.warn('YellowBox is disabled.');
    var isChecked = this.state.checked ? 'yes' : 'no';
    if (this.state.detailDataLoaded) {
      return (
        <View style={{flex: 1, backgroundColor: '#f7f7f7',}}>
          <View style={{
            height: (Platform.OS === 'android' ? 42 : 50),
            backgroundColor: '#fff',
            flexDeriction: 'row',
            alignItem: 'center',
            marginTop: 24,
            paddingTop: 15,
            paddingLeft: 18
          }}>
            <TouchableOpacity
              style={{top: 15, left: 18, position: 'absolute', zIndex: 999999}}
              onPress={() => this.pageJump()}
            >
              <Image source={require('../img/ic_back.png')}/>
            </TouchableOpacity>
            <Text style={{textAlign: 'center', color: '#313131', fontSize: 18,}}>实时运单</Text>
          </View>
          <View style={routeStyle.rContianer}>
            <View style={{flex: 3,}}>
              <Image style={{alignItems: 'center', justifyContent: 'flex-end', resizeMode: Image.resizeMode.cover}}
                     source={require('../img/orderrealtime.png')}><Text
                style={{textAlign: 'center', color: '#fff', marginBottom: 50,}}>预计<Text
                style={{fontSize: 22,}} value={this.state.durationValue}>{this.state.durationValue}&nbsp;&nbsp;</Text>分钟后到达</Text></Image>
            </View>

            <View style={[routeStyle.rItem, {marginTop: 0}]}>
              <Text
                style={routeStyle.rTextLeft}>联系人电话:&nbsp;&nbsp;&nbsp;{this.state.detailData.order.route.airport[1].phone}</Text>
              <Image source={require('../img/phone.png')}/>
            </View>

            <View style={[routeStyle.rItem, {marginBottom: 1,}]}>
              <Text style={routeStyle.rTextLeft}>运单编号:&nbsp;&nbsp;&nbsp;{this.state.detailData.order.id}</Text>
              <Text
                style={routeStyle.rTextRight}>运送中</Text>
            </View>

            <View style={[routeStyle.rItem, {height: 80}]}>
              <Image source={require('../img/flight.png')}/>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={[routeStyle.rItem, {height: 20}]}>
                  <Text style={routeStyle.rTextLeft}>型号:&nbsp;&nbsp;{this.state.detailData.order.fid}</Text>
                </View>
                <View style={[routeStyle.rItem, {height: 16}]}>
                  <Image style={{width: 7, height: 11, marginRight: 5,}} source={require('../img/spoint.png')}/>
                  <Text style={routeStyle.rTextLeft}>{this.state.detailData.order.route.airport[0].name}</Text>
                </View>

                <View style={[routeStyle.rItem, {height: 16}]}>
                  <Image style={{width: 7, height: 11, marginRight: 5,}} source={require('../img/epoint.png')}/>
                  <Text style={routeStyle.rTextLeft}>{this.state.detailData.order.route.airport[1].name}</Text>
                </View>
              </View>
            </View>

            <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', height: 70,}}>
              <Image style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 70,
                resizeMode: Image.resizeMode.contain
              }}
                     source={require('../img/flight02.png')}><Text
                style={{textAlign: 'center'}}>距离投递点<Text style={{
                fontSize: 22,
                color: '#313131',
              }}>{this.state.durationValue}&nbsp;&nbsp;</Text>公里</Text></Image>
            </View>
          </View>

          <TouchableOpacity style={this.state.buttonStatus ? routeStyle.button2 : routeStyle.button1} onPress={()=> {
            this.orderConfirm()
          }}>
            <Text style={{color: '#fff',}}>确认收货</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1, backgroundColor: '#f7f7f7',}}>
          <View style={{
            height: (Platform.OS === 'android' ? 42 : 50),
            backgroundColor: '#fff',
            flexDeriction: 'row',
            alignItem: 'center',
            marginTop: 24,
            paddingTop: 15,
            paddingLeft: 18
          }}>
            <TouchableOpacity
              style={{top: 15, left: 18, position: 'absolute', zIndex: 999999}}
              onPress={() => this.pageJump()}
            >
              <Image source={require('../img/ic_back.png')}/>
            </TouchableOpacity>
            <Text style={{textAlign: 'center', color: '#313131', fontSize: 18,}}>实时运单</Text>
          </View>
          <Text
            style={{textAlign: 'center', justifyContent: 'center', alignItem: 'center'}}>加载数据中......</Text>
        </View>
      )
    }
  }
}

const
  routeStyle = StyleSheet.create({
    rContianer: {
      flex: 1,
      backgroundColor: '#f7f7f7',
    },
    rItem: {
      paddingLeft: 18,
      height: 34,
      paddingRight: 18,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#313131',
      marginBottom: 1,
      backgroundColor: '#fff',
    },
    rTextLeft: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      color: '#313131',
    },
    rTextRight: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      color: '#313131',
      textAlign: 'right',
    },
    button1: {
      backgroundColor: '#ddd',
      marginTop: 10,
      height: 54,
      borderWidth: 0.3,
      borderColor: '#a09f9f',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 17,
      color: '#55ACEE',
      margin: 18,
    },
    button2: {
      backgroundColor: '#313131',
      marginTop: 10,
      height: 54,
      borderWidth: 0.3,
      borderColor: '#a09f9f',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 17,
      color: '#55ACEE',
      margin: 18,
    }
  });