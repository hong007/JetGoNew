/**
 * Created by hongty on 2016/11/15.
 */
import React, {Component} from 'react';
import {
    ToolbarAndroid,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Platform,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import EditView from './EditView';
import Button from './Button';
import Main from './Main';
import NetUtil from './NetUtil';

// var LOGIN_USERNAME = '';
// var LOGIN_PASSWORD = '';
// var LOGIN_TOKEN = '';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.userName = "";
        this.password = "";
    }

    openDrawer() {
        this.refs.drawerLayout.openDrawer()
    }

    render() {
        console.disableYellowBox = true;
        console.warn('YellowBox is disabled.');
        return (
            <View style={LoginStyles.loginview}>
                <Text style={{fontSize: 22, color: '#fff',}}>用户登录</Text>
                <View style={{paddingTop: 38,}}>
                    <Text style={{color: '#a09f9f',marginTop:20,}}>用户名</Text>
                    <EditView name='' onChangeText={(text) => {
                        this.userName = text;
                    }}/>
                    <Text style={{color: '#a09f9f',marginTop:20,}}>密码</Text>
                    <EditView name='password' onChangeText={(text) => {
                        this.passWord = text;
                    }}/>
                    <Button name='登录' onPressCallback={()=>this.onPressCallback()}/>
                </View>
            </View>
        )
    }

    onPressCallback() {
        // this.pageJump();
        let url = "http://jieyan.xyitech.com/login/?username=" + this.userName + "&password=" + this.passWord;
        NetUtil.postJson(url,(responseText)=>{
            let curdata=JSON.parse(responseText);
            if (curdata.err == '0') {
                // alert('存储的token是 ' + String(curdata.token));
                AsyncStorage.setItem("LOGIN_TOKEN",curdata.token);
                // this.getAirPorts(curdata.token);
                this.pageJump();
            } else {
                alert("用户名或密码错误，请重试")
            }
        });
    };
    // getAirPorts(token){
    //     let url = "http://jieyan.xyitech.com/spoint/list?token="+token;
    //     NetUtil.postJson(url, (responseText)=> {
    //         let curdata = JSON.parse(responseText);
    //         if (curdata.err == '0') {
    //             let airports = JSON.stringify(curdata.msg);
    //             AsyncStorage.setItem("AIRPORTS",airports);
    //             this.pageJump();
    //         } else {
    //             alert("获取航路失败请重试");
    //         }
    //     });
    // }

    //跳转到第二个页面去
    pageJump() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                title: '主页',
                name: 'Main',
                component: Main,
            });
        }
    }
}

const LoginStyles = StyleSheet.create({
    loginview: {
        flex: 1,
        padding: 30,
        paddingTop: (Platform.OS === 'android' ? 102 : 110),
        backgroundColor: '#313131',
    },
});