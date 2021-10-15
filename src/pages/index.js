import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu} from 'antd';
import './world';
import *as echarts from 'echarts';
import {CartesianGrid, Legend, Tooltip, XAxis, YAxis,Brush,Line,LineChart} from 'recharts';
import jsonDate from './all.json';
import {NavLink} from "react-router-dom";
//console.log(jsonDate)


const { Header, Content, Footer } = Layout;

let nameObj = {
}
//数据处理
// jsonDate.forEach((item)=>{
//     //初始化
//     if(nameObj[item.Country_Region]===undefined){
//         nameObj[item.Country_Region] = {
//             Confirmed:0,
//             Country_Region:''
//         }
//     }
//
//      item.Confirmed = item.Confirmed?item.Confirmed:0;
//
//     nameObj[item.Country_Region] = {
//         //统计处理
//         value:nameObj[item.Country_Region].Confirmed+item.Confirmed,
//
//     }
// });
jsonDate.map((item) => {
    if(!nameObj[item.Country_Region])
        nameObj[item.Country_Region] = {
            'value':0
        };

    //nameObj[item.Country_Region].value+=item.Confirmed;
    nameObj[item.Country_Region].value+=Math.round(item.Confirmed);
})

console.log(nameObj)

let allList = []//定义一个空数组

for (const key in nameObj) {
    nameObj[key].name=key
    //将信息的名字进行加载
    allList.push(nameObj[key])
}
 /* console.log(allList)
for(let i=0;i<allList.length;i++){
    allList[i].value = allList[i].value.replace("\"","")
}
console.log(allList)*/



export default class Index extends React.Component{

    componentDidMount() {
        let myCharts = echarts.init(document.getElementById('worldMap'))
        // console.log('echarts')
        myCharts.setOption({
            //标题组件
            title: {
                text: 'Global Map',
                left: 'center'
            },
            //提示框组件
            tooltip: {
                //触发类型 item:数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                trigger: 'item'
            },
            //图例组件
            legend: {
                //图例列表的布局朝向。'horizontal'  'vertical'
                show: false,
                orient: 'horizontal',
                // left: 'left',
                data: ['Global Map']
            },
            //视觉映射组件
            visualMap: {
                type: 'piecewise',
                pieces: [
                    { min: 10000000, max: 100000000, label: '≥10000000', color: '#372a28' },
                    { min: 1000000, max: 9999999, label: '5000-10000000', color: '#4e160f' },
                    { min: 100000, max: 999999, label: '1000000-5000000', color: '#974236' },
                    { min: 10000, max: 99999, label: '10000-1000000', color: '#ee7263' },
                    { min: 1, max: 9999, label: '1-10000', color: '#f5bba7' },
                ],
                //图元的颜色
                color: ['#E0022B', '#E09107', '#A3E00B'],
                orient: 'horizontal',
            },
            //工具栏
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    //系列名称，用于tooltip的显示
                    name: 'submit',
                    type: 'map',
                    map: 'world',

                    aspectScale:0.75,
                    left: 5, top: 20, right: 5, bottom: 0,
                    boundingCoords: [
                        // 定位左上角经纬度
                        [-180, 90],
                        // 定位右下角经纬度
                        [180, -90]
                    ],
                    //是否开启鼠标缩放和平移漫游,如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                    roam: true,
                    //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
                    label: {
                        show: true,//是否显示标签。
                        color: 'rgb(249, 249, 249)'
                    },
                    data:allList//添加数据方法二
                    /*添加数据方法一
                    data:[//里面存放数据
                        //{
                        //     name:'中国'，
                        //     value:1122
                        // },{
                        //      name:'美国',
                        //      value:89999
                        // }
                    ]
                     */
                }]
        })

    }



    render(props) {
        const pathname = this.props.history.location.pathname;
        let deFauLS = [];
        deFauLS.push(pathname);
        return (
            <Layout className="layout">
                <Header style={{backgroundColor:'#142850'}}>
                    {/*defaultSelectedKeys={['/']}*/}
                    <Menu theme="dark" mode="horizontal"  selectedKeys={deFauLS} style={{backgroundColor:'#142850'}}>
                        <Menu.Item key={'/'} >
                            <NavLink style={{textDecoration:'none',color:'white'}} to={"/"} >Home</NavLink>
                        </Menu.Item>
                        <Menu.Item key={'/ShowData'} >
                            <NavLink style={{textDecoration:'none',color:'white'}} to={"/ShowData"} >Data Display</NavLink>
                        </Menu.Item>
                        <Menu.Item key={'/page'} >
                            <NavLink  to={"/page"} style={{textDecoration:'none',color:'white'}}>Model Calculation</NavLink>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px'}}>
                    <div className="content">
                        <div className="content_left">
                            <div id="worldMap" style={{height: 600, width: 800}}/>
                        </div>
                        <div className="content_right">
                            <div className="content_right_header">
                                <div className={'chart'}>
                                    <LineChart  width={300} height={300} margin={{top:5,right:5,left:5,bottom:5}}>
                                        <defs>
                                            <linearGradient id="color_con" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#47D6FF" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#47D6FF" stopOpacity={0.1}/>
                                            </linearGradient>
                                            <linearGradient id="color_dea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF9B52" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#FF9B52" stopOpacity={0.1}/>
                                            </linearGradient>
                                            <linearGradient id="color_rec" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#50FF14" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#50FF14" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <Line type="monotone" dataKey={'confirmed'} stroke="#47D6FF"  />
                                        <Line type="monotone" dataKey={'deaths'} stroke="#FF9B52"  />
                                        <Line type="monotone" dataKey={'recovered'} stroke="#50FF14"  />
                                        <XAxis dataKey={'last_update'} />
                                        <YAxis label={{ value: 'number', angle: -90, position: 'insideLeft' }} />
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip />
                                        <Brush height={10}/>
                                        <Legend />
                                    </LineChart>
                                </div>
                            </div>
                            <div className="content_right_footer">待填</div>
                        </div>
                    </div>
                </Content>
                <Footer  className={'bb_2'} style={{ textAlign: 'center',}}>
                    地址：天津市西青区宾水西道399号
                    <br />
                    邮编：300387
                </Footer>
            </Layout>

        )
    }
}