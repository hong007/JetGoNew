/**
 * Created by hongty on 2016/11/15.
 */
import React from 'react';
import {
  View,
  Navigator,
  ToolbarAndroid,
  Text,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  ToastAndroid,
  AsyncStorage,
  TouchableOpacity,
  DrawerLayoutAndroid,
  TouchableHighlight
} from 'react-native';
const menu_user = require('../img/menu_user.png');
const menu_order = require('../img/menu_order.png');
const menu_phone = require('../img/menu_phone.png');
const menu_lay = require('../img/menu_lay.png');
const menu_about = require('../img/menu_about.png');
const menu_quit = require('../img/menu_quit.png');

import ScanComponent from './ScanComponent';
import PickerComponent from './PickerComponent';
import Button from './Button';
import LeftMenuList from './LeftMenuList';
import NetUtil from './NetUtil';
import OrderListView from './OrderListView';
import LoginPage from './LoginPage';
import OnlineHelp from './OnlineHelp';
import Lawyer from './Lawyer';
import AboutUS from './AboutUS';
import Ctrl from './Ctrl';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routeid: '',
      loginName: '犀利哥',
      isLogin: true,
    };
  }

  //回到第一个页面去
  onJump() {
    const {navigator} = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  componentWillMount() {
    // StatusBar.setBackgroundColor('#f00', true);
    Ctrl.setStatusBar();
    let _this = this;
    _this.setState({
      loginStatus: false,
    });
    AsyncStorage.multiGet(["LOGIN_TOKEN", "LOGIN_USERNAME"], function (errs, result) {
      //TODO:错误处理
      if (!errs) {
        // let Token = result;
        let curdata = result;
        let curToken = result[0][1];
        let curUsername = result[1][1];
        if (curToken && curToken != '' && curUsername && curUsername != '') {
          if (curToken.length > 60 && curUsername.length >= 1) {
            _this.setState({
              loginName: curUsername,
              isLogin: true,
            })
          } else {
            _this.setState({
              loginName: "登录"
            })
          }
        }
        // console.log("取得缓存中的Token是  ", curToken, "  长度是  ",curToken.lenght);
        // alert("取得缓存中的result是  " + curToken + "  长度是  " + curToken.length+"   "+ "curUsername  "+curUsername+"  长度是  " + curUsername.length+"   ");
      }
    });
  }

  pageJump() {
    this.props.navigator.push({
      title: '订单列表',
      name: 'OrderListView',
      component: OrderListView
    });
  }

  _openPage() {
    this.props.navigator.push({
      title: '飞机扫码',
      name: 'ScanComponent',
      component: ScanComponent
    })
  }

  openDrawer() {
    this.refs.drawerLayout.openDrawer()
  }

  closeDrawer() {
    this.refs.drawerLayout.closeDrawer()
  }

  fatherGetChildData() {
    this.refs.picker.getChildData();
    alert("来来来！")
  }

  _openLeftMenuPage(name) {
    let curPage = name;
    if (curPage == "LoginPage") {
      if (this.state.loginName == "登录") {
        this.props.navigator.push({
          name: "LoginPage",
          component: LoginPage,
        });
      } else {
        return
      }

    } else if (curPage == "OrderListView") {
      this.props.navigator.push({
        name: "OrderListView",
        component: OrderListView,
      });
    } else if (curPage == "OnlineHelp") {
      this.props.navigator.push({
        name: "OnlineHelp",
        component: OnlineHelp,
      });
    } else if (curPage == "Lawyer") {
      this.props.navigator.push({
        name: "Lawyer",
        component: Lawyer,
      });
    } else if (curPage == "AboutUS") {
      this.props.navigator.push({
        name: "AboutUS",
        component: AboutUS,
      });
    } else if (curPage == "QuitLogin") {
      AsyncStorage.setItem("LOGIN_USERNAME", '');
      AsyncStorage.setItem("LOGIN_USERPWD", '');
      AsyncStorage.setItem("LOGIN_TOKEN", '');
      this.props.navigator.push({
        name: "LoginPage",
        component: LoginPage,
      });
    }
  }

  render() {
    console.disableYellowBox = true;
    console.warn('YellowBox is disabled.');
    if (this.state.isLogin) {
      var navigationView = (
        <View style={{flex: 1, backgroundColor: '#1b1b1b', paddingTop: 24,}}
              onPress={()=>this.closeDrawer()}
        >
          <LeftMenuList title={this.state.loginName} pageName="LoginPage" imageSource={menu_user}
                        _leftMenuPress={(pageName)=> {
                          this._openLeftMenuPage(pageName)
                        }}/>
          <LeftMenuList title='我的订单' pageName="OrderListView" imageSource={menu_order} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
          <LeftMenuList title='在线帮助' pageName="OnlineHelp" imageSource={menu_phone} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
          <LeftMenuList title='法律条款' pageName="Lawyer" imageSource={menu_lay} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
          <LeftMenuList title='关于捷雁' pageName="AboutUS" imageSource={menu_about} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: 40,
            paddingLeft: 30,
            position: 'absolute',
            bottom: 30,
            left: 0,
          }} onPress={(value)=> {
            this._openLeftMenuPage('QuitLogin')
          }}>
            <Image
              style={{
                resizeMode: Image.resizeMode.strech,
                marginLeft: 5,
              }}
              source={menu_quit}
            />
            <Text style={{
              fontSize: 16 * Ctrl.pxToDp(),
              marginLeft: 15,
              textAlign: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              退出
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      var navigationView = (
        <View style={{flex: 1, backgroundColor: '#1b1b1b', paddingTop: 24,}}
              onPress={()=>this.closeDrawer()}
        >
          <LeftMenuList title={this.state.loginName} pageName="LoginPage" imageSource={menu_user}
                        _leftMenuPress={(pageName)=> {
                          this._openLeftMenuPage(pageName)
                        }}/>
          <LeftMenuList title='我的订单' pageName="OrderListView" imageSource={menu_order} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
          <LeftMenuList title='在线帮助' pageName="OnlineHelp" imageSource={menu_phone} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
          <LeftMenuList title='法律条款' pageName="Lawyer" imageSource={menu_lay} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
          <LeftMenuList title='关于捷雁' pageName="AboutUS" imageSource={menu_about} _leftMenuPress={(pageName)=> {
            this._openLeftMenuPage(pageName)
          }}/>
        </View>
      );
    }

    return (
      <DrawerLayoutAndroid
        ref={'drawerLayout'}
        drawerBackgroundColor="rgba(188,0,202,0.5)"
        drawerWidth={260 * Ctrl.pxToDp()}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
        onDrawerOpen={()=> {
          console.log('打开了')
        }}
        onDrawerClose={()=> {
          console.log('关闭了')
        }}
        onDrawerSlide={()=>console.log("正在交互......")}
        keyboardDismissMode="on-drag"
        statusBarBackgroundColor='transparent'
      >
        <View style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: '#FFF'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            height: (Platform.OS === 'android' ? 42 : 50),
            backgroundColor: '#fff',
            paddingLeft: 18,
          }}>
            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center',}}>
              <TouchableOpacity style={{
                width: 34,
                alignItems: 'flex-start',
                justifyContent: 'center',
                height: (Platform.OS === 'android' ? 42 : 50)
              }}
                                onPress={()=>this.openDrawer()}>
                <Image style={{}} source={require('../img/menu.png')}/>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
              <Image source={require('../img/jy_logo.png')}/>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center',}}>
              <TouchableOpacity style={{
                alignItems: 'flex-start',
                justifyContent: 'center',
                height: (Platform.OS === 'android' ? 42 : 50),
                paddingRight: 18,
              }} onPress={() => this.pageJump()}>
                <Image source={require('../img/icon_order.png')}/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 4, marginTop: 20, padding: 18,}}>
            <PickerComponent refs="picker"/>
          </View>
          <TouchableOpacity style={{
            backgroundColor: '#313131',
            marginTop: 10,
            height: 54 * Ctrl.pxToDp(),
            borderWidth: 0.3,
            borderColor: '#a09f9f',
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#55ACEE',
            margin: 18,
            zIndex: 9999,
          }} onPress={()=> {
            this._openPage()
          }}>
            <Text style={{color: '#fff', fontSize: 17 * Ctrl.pxToDp(),}}>我要寄件</Text>
          </TouchableOpacity>
          <Image style={{
            zIndex: -1,
            position: 'absolute',
            top: 34,
            left: 0,
            right: 0,
            bottom: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }} source={require('../img/bg.png')}>
          </Image>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}