/**
 * Created by hongty on 2016/11/14.
 */
import React, {Component} from 'react';
import  {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import getFlight from './getFlight';
import NetUtil from './NetUtil';
import GridChild from './GridChild';

class ScanComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scannText:'',
            text: '',
            dataload: false,
            sname: '',
            ename: '',
            distance: '',
            duration: '',
            initialChecked: false,
            totalChecked: 0,
        };
    }

    onChildChanged(newState) {
        // alert(newState);
        if (newState == true) {
            newState = -1;
        } else {
            newState = 1;
        }
        // var newTotal = this.state.totalChecked + (newState ? 1 : -1);
        var newTotal = this.state.totalChecked + newState;
        this.setState({
            totalChecked: newTotal,
        });
    }

    componentDidMount() {
        let _this = this;
        AsyncStorage.getItem("ROUTE_ID", function (errs, result) {
            //TODO:错误处理
            if (!errs) {
                // alert("取得的AIRPORTS是" + result);
                // this.initAirPorts(result);
                let route_id = result;

                let url = "http://jieyan.xyitech.com/config/route?token=MiMxNDc2MjUzOTU4QGppZXlhbi54eWl0ZWNoLmNvbSNiUy9odVhnK1VtUUlsVFNmejdWVXBBa1N0SGM9&id=" + route_id;
                NetUtil.postJson(url, (responseText)=> {
                    let curdata = JSON.parse(responseText);
                    console.log("获得的单个航路信息是  ", curdata);
                    if (curdata.err == '0') {
                        _this.setState({
                            // sname:"121",
                            dataload: true,
                            sname: curdata.route.sname,
                            ename: curdata.route.ename,
                            distance: (curdata.route.distance / 1000).toFixed(0),
                            duration: (curdata.route.duration / 60).toFixed(0),
                        });
                        // this.pageJump();
                        // this._saveValue_One("LOGIN_TOKEN",curdata.token);
                    } else {
                        alert("没有该航路，请重试")
                    }
                });
                // alert(route_id)
            }
        });


        // var token = AsyncStorage.getItem(LOGIN_TOKEN);
        // alert(token);
        // let url = "http://jieyan.xyitech.com/config/allroute?token?"+token;
        // NetUtil.postJson(url,(responseText)=>{
        //     alert(responseText);
        //     let curdata=JSON.parse(responseText);
        //     if (curdata.err == '0') {
        //         this.pageJump();
        //         this._saveValue_One("LOGIN_TOKEN",curdata.token);
        //     } else {
        //         alert("用户名或密码错误，请重试")
        //     }
        // });
    }

    packageClick() {

    }

    // //初始化数据-默认从AsyncStorage中获取数据
    // async _loadInitialState() {
    //     try {
    //         var value = await AsyncStorage.getItem(LOGIN_TOKEN);
    //         if (value != null) {
    //             this._appendMessage('从存储中获取到数据为:' + value);
    //         } else {
    //             this._appendMessage('存储中无数据,初始化为空数据');
    //         }
    //     } catch (error) {
    //         // this._appendMessage('AsyncStorage错误' + error.message);
    //     }
    // }

    _openPage() {
        this.props.navigator.push({
            title: '飞机起飞',
            name: 'getFlight',
            component: getFlight
        })
    }

    render() {
        console.disableYellowBox = true;
        console.warn('YellowBox is disabled.');
        if (this.state.dataload) {
            return (
                <View style={{
                    flex: 1,
                    backgroundColor: '#f7f7f7',
                    paddingTop: 12,
                    marginTop: (Platform.OS === 'android' ? 66 : 74)
                }}>
                    <View style={scanStyle.TextInputView}>
                        <TextInput style={scanStyle.TextInput}
                                   underlineColorAndroid='transparent'
                                   placeholder='扫码或输入无人机上的二维码'
                                   onChangeText={
                                       (scannText) => {
                                           this.setState({scannText});
                                       }
                                   }
                        />
                        <Text style={{height:0,}}>{this.state.scannText}</Text>
                    </View>
                    <View style={routeStyle.rContianer}>
                        {/*<View style={routeStyle.rItem}>*/}
                        {/*<Text style={routeStyle.rTextLeft}>无人机编号</Text>*/}
                        {/*<Text style={routeStyle.rTextRight}>131231231</Text>*/}
                        {/*</View>*/}
                        <View style={routeStyle.rItem}>
                            <Text style={routeStyle.rTextLeft}>无人机行程</Text>
                            <Text style={routeStyle.rTextRight}>{this.state.sname}-{this.state.ename}</Text>
                        </View>
                        <View style={routeStyle.rItem}>
                            <Text style={routeStyle.rTextLeft}>飞行距离</Text>
                            <Text style={routeStyle.rTextRight}><Text
                                style={routeStyle.rTextValue}>{this.state.distance}</Text><Text
                                style={routeStyle.rTextName}>公里</Text></Text>
                        </View>
                        <View style={routeStyle.rItem}>
                            <Text style={routeStyle.rTextLeft}>飞行时间</Text>
                            <Text style={routeStyle.rTextRight}><Text
                                style={routeStyle.rTextValue}>{this.state.duration}</Text><Text
                                style={routeStyle.rTextName}>分钟</Text></Text>
                        </View>
                    </View>

                    <View style={[scanStyle.gridContainer, {flex: 1,}]}>
                        <Text style={scanStyle.gridTitle}>请选择货物类型(多选)</Text>
                        <View style={scanStyle.gridContent}>
                            <GridChild text="报纸" initialChecked={this.state.initialChecked} callbackParent={(initialChecked)=>this.onChildChanged(initialChecked)}/>
                            <GridChild text="信件" initialChecked={this.state.initialChecked} callbackParent={(initialChecked)=>this.onChildChanged(initialChecked)}/>
                            <GridChild text="刊物" initialChecked={this.state.initialChecked} callbackParent={(initialChecked)=>this.onChildChanged(initialChecked)}/>

                        </View>

                        <View style={[scanStyle.gridContent, {marginTop: -30}]}>
                            <GridChild text="包裹" initialChecked={this.state.initialChecked} callbackParent={(initialChecked)=>this.onChildChanged(initialChecked)}/>
                            <GridChild text="其他" initialChecked={this.state.initialChecked} callbackParent={(initialChecked)=>this.onChildChanged(initialChecked)}/>
                        </View>
                    </View>

                    <TouchableOpacity style={{
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
                    }} onPress={this._openPage.bind(this)}>
                        <Text style={{color: '#fff',}}>提交</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <Text>页面载入中</Text>
            )
        }

    }
}
const routeStyle = StyleSheet.create({
    rContianer: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    rItem: {
        flex: 1,
        paddingLeft: 18,
        height: 44,
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
    },
    rTextRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'right',
    },
    rTextValue: {
        color: '#E98B21',
    }
})
const scanStyle = StyleSheet.create({
    TextInputView: {
        height: 44,
        flexDirection: 'column',
        justifyContent: 'center',
        color: '#a09f9f',
        fontSize: 14,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#fff',
        marginBottom: 1
    },
    TextInput: {
        height: 44,
    },
    gridContainer: {
        flex: 1,
        marginTop: 20,
    },
    gridContent: {
        flex: 1,
        height: 60,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 10,
    },
    gridTitle: {
        fontSize: 16,
        color: '#313131',
        marginBottom: 14,
        marginLeft: 16,
    },
    gridItem: {
        width: 72,
        height: 36,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        color: '#a09f9f',
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 2.4,
        paddingTop: 8,
    },
    gridText: {
        width: 72,
        textAlign: 'center',
    }

})
export default ScanComponent;
