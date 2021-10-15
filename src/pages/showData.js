import React from "react";
import XLSX from 'xlsx';
import './showData.css';
import './config.js';
import {CartesianGrid, Legend,Tooltip, XAxis, YAxis, Area,Brush,Line,LineChart} from 'recharts';
import {Select,Button,Layout,Menu,Breadcrumb} from "antd";
import 'antd/dist/antd.css';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import {NavLink} from "react-router-dom";
import TweenOne from 'rc-tween-one';

// import { createBrowserHistory } from 'history';
//
// const history = createBrowserHistory();
const { Header, Content, Sider ,Footer} = Layout;
let tmpDown;

const {Option} = Select;
const { SubMenu } = Menu;



export default class ShowData extends React.Component{
    static defaultProps = {
        className: 'linked-animate-demo',
    };

    num = 20;// 点的个数

    constructor(props){
        super(props);
        this.state={
            ch : global.yxx,
            inpValu:'',
            data:global.zzh,
            text:"",
            href:"",
            tot_data:'',
            draw:[{country_region:''}],
            newcon:'',
            newdea:'',
            newrec:'',
            data1: getPointPos(1500, 850, this.num).map(item => ({
                ...item,
                opacity: Math.random() * 0.2 + 0.05,
                backgroundColor: `rgb(${Math.round(Math.random() * 95 + 160)},255,255)`,
            })),
            tx: 0,
            ty: 0,
        };
    }
    onMouseMove = (e) => {
        const cX = e.clientX;
        const cY = e.clientY;
        const boxRect = this.box.getBoundingClientRect();
        const pos = this.state.data1.map((item) => {
            const { x, y, radius } = item;
            return { x, y, distance: getDistance({ x: cX - boxRect.x, y: cY - boxRect.y }, { x, y }) - radius };
        }).reduce((a, b) => {
            if (!a.distance || a.distance > b.distance) {
                return b;
            }
            return a;
        });
        if (pos.distance < 60) {
            this.setState({
                tx: pos.x,
                ty: pos.y,
            });
        } else {
            this.onMouseLeave();
        }
    }

    onMouseLeave = () => {
        this.setState({
            tx: 0,
            ty: 0,
        });
    }

    handleChange=(value)=> {
        let arr=[],new_con,new_dea,new_rec;
        const _this=this;
        axios.get(`http://127.0.0.1:8000/country?country=${value}`)
            .then(function (res) {
                let data0=res.data.replace(/\[|]/g,'');
                let data1=data0.replace(/\'/g, '"');
                let data2=data1.split("}}");
                for(let i=0;i<data2.length-1;i++){
                    let temp=data2[i]+"}}";
                    arr[i]=JSON.parse(temp).fields;
                    if(i===data2.length-2){
                        console.log(arr[i]['deaths']);
                        console.log(arr[i-1]['deaths']);
                        new_dea=arr[i].deaths-arr[i-1].deaths;
                        new_con=arr[i].confirmed-arr[i-1].confirmed;
                        new_rec=arr[i].recovered-arr[i-1].recovered;
                    }
                }
                _this.setState({
                    draw:arr,
                    newcon:new_con,
                    newdea:new_dea,
                    newrec:new_rec,
                });
            });
    };
    us = (e) =>{
        let arr=[],new_con,new_dea,new_rec;
        const _this=this;
        axios.get("http://127.0.0.1:8000/country?country="+e)
            .then(function (res) {
                let data0=res.data.replace(/\[|]/g,'');
                let data1=data0.replace(/\'/g, '"');
                let data2=data1.split("}}");
                for(let i=0;i<data2.length-1;i++){
                    let temp=data2[i]+"}}";
                    arr[i]=JSON.parse(temp).fields;
                    if(i===data2.length-2){
                        console.log(arr[i]['deaths']);
                        console.log(arr[i-1]['deaths']);
                        new_dea=arr[i].deaths-arr[i-1].deaths;
                        new_con=arr[i].confirmed-arr[i-1].confirmed;
                        new_rec=arr[i].recovered-arr[i-1].recovered;
                    }
                }
                _this.setState({
                    draw:arr,
                    newcon:new_con,
                    newdea:new_dea,
                    newrec:new_rec,
                });
            });
    };
    downloadExl = (json,type) =>{

        let  tmpdata = json[0];
        json.unshift({});
        let keyMap = []; //获取keys
        for (let k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        tmpdata = [];//用来保存转换好的json
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
            v: v[k],
            position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var tmpWB = {
            SheetNames: ['mySheet'], //保存的表标题
            Sheets: {
                'mySheet': Object.assign({},
                    tmpdata, //内容
                    {
                        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                    })
            }
        };
        tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
            {bookType: (type === undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
        ))], {
            type: ""
        }); //创建二进制对象写入转换好的字节流
        let href = URL.createObjectURL(tmpDown); //创建对象超链接
        this.state.href=href;
        setTimeout(function() { //延时释放
            URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
    };

    s2ab=(s)=> { //字符串转字符流
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
    getCharCol=(n)=> {
        let s = '', m = 0;
        while (n > 0) {
            m = n % 26 + 1;
            s = String.fromCharCode(m + 64) + s;
            n = (n - m) / 26;
        }
        return s
    };
    toPage=()=>{
        console.log('222');
        // this.props.history.push('./page');
        console.log('111')
    };
    DtoPage=()=>{
        console.log('222');
    };

    render() {
        const pathname = this.props.history.location.pathname;
        const { className } = this.props;
        const { data1, tx, ty } = this.state;
        let defaulS = [];
        defaulS.push(pathname);
        console.log(defaulS);
        return(
            <div className={`${className}-wrapper1`}>
                <div
                    className={`${className}-box1`}
                    ref={(c) => { this.box = c; }}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={this.onMouseLeave}
                >
                    {data1.map((item, i) => (
                        <Point {...item} tx={tx} ty={ty} key={i.toString()} className={`${className}-block`} />
                    ))}
                </div>
            <Layout>
                <Header style={{backgroundColor:'#142850'}}>
                    {/*defaultSelectedKeys={['/']}*/}
                    <Menu theme="dark" mode="horizontal"  selectedKeys={defaulS} style={{backgroundColor:'#142850'}}>
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
            <Layout>
                <ProCountry pfn={this.us.bind(this)}/>
            <Layout className={'aa_2'} style={{padding: '0 24px 24px'}}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item className={'aaa'}>{this.state.draw[0]['country_region']} </Breadcrumb.Item>
                    <div className={'sele'}>
                        <Select
                            showSearch
                            style={{ width: 200}}
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={this.handleChange}
                        >
                            {global.gl_country.map((pro)=>{
                                return (
                                    <Option value={pro} key={pro} >{pro}</Option>
                                )
                            })}
                        </Select>
                    </div>
                </Breadcrumb>
            <Content style={{overflow: 'initial'}} className={'cont'}>
                <div className={"top"}>
                    <div className={'newdata'} style={{width:'20%'}}>new</div>
                    <div className={'confirmed'} style={{width:'50%'}}>confirmed:{this.state.newcon}</div>
                    <div className={'deaths'} style={{width:'50%'}}>deaths:{this.state.newdea}</div>
                    <div className={'recovered'} style={{width:'50%'}}>recovered:{this.state.newrec}</div>
                    <div className={"down"}>
                        <Button style={{backgroundColor:'#11cbd7',border:'#11cbd7 solid'}} type="primary"  icon={<DownloadOutlined />} onClick={this.downloadExl(this.state.draw)} href={this.state.href} download={'demo.xlsx'}>
                            Download
                        </Button>
                    </div>
                </div>
                <div className={'chart'}>
                <LineChart  data = {this.state.draw} width={1000} height={560} >
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
                    <YAxis label={{ value: 'the number of people', angle: -90, position: 'insideLeft' }} />
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip />
                    <Brush height={15}/>
                    <Legend />
                </LineChart>
                </div>
            </Content>
            </Layout>
            </Layout>
                <Footer  className={'bb_2'} style={{ textAlign: 'center',}}>
                    地址：天津市西青区宾水西道399号
                    <br />
                    邮编：300387
                </Footer>
            </Layout>
            </div>
        )
    }

}

class GridLayout {
    constructor(rect, width, height) {
        this.gridX = Math.floor(width / rect);
        this.gridY = Math.floor(height / rect);
        this.cellWidth = width / this.gridX;
        this.cellHeight = height / this.gridY;
        this.grid = [];
        for (let i = 0; i < this.gridY; i += 1) {
            this.grid[i] = [];
            for (let s = 0; s < this.gridX; s += 1) {
                this.grid[i][s] = [];
            }
        }
    }

    getCells = (e) => {
        const gridArray = [];
        const w1 = Math.floor((e.x - e.radius) / this.cellWidth);
        const w2 = Math.ceil((e.x + e.radius) / this.cellWidth);
        const h1 = Math.floor((e.y - e.radius) / this.cellHeight);
        const h2 = Math.ceil((e.y + e.radius) / this.cellHeight);
        for (let c = h1; c < h2; c += 1) {
            for (let l = w1; l < w2; l += 1) {
                gridArray.push(this.grid[c][l]);
            }
        }
        return gridArray;
    }

    hasCollisions = t => (
        this.getCells(t).some(e => e.some(v => this.collides(t, v)))
    )

    collides = (t, a) => {
        if (t === a) {
            return false;
        }
        const n = t.x - a.x;
        const i = t.y - a.y;
        const r = t.radius + a.radius;
        return n * n + i * i < r * r;
    }

    add = (value) => {
        this.getCells(value).forEach((item) => {
            item.push(value);
        });
    }
}

const getPointPos = (width, height, length) => {
    const grid = new GridLayout(150, width, height);
    const posArray = [];
    const num = 500;
    const radiusArray = [25, 35, 50];
    for (let i = 0; i < length; i += 1) {
        let radius;
        let pos;
        let j = 0;
        for(let j =0; j< num; j+=1) {
            radius = radiusArray[Math.floor(Math.random() * radiusArray.length)];
            pos = { x: Math.random() * (width - radius * 2) + radius, y: Math.random() * (height - radius * 2) + radius, radius };
            if (!grid.hasCollisions(pos)) {
                break;
            }
        }
        posArray.push(pos);
        grid.add(pos);
    }
    return posArray;
};

const getDistance = (t, a) => (Math.sqrt((t.x - a.x) * (t.x - a.x) + (t.y - a.y) * (t.y - a.y)));

class Point extends React.PureComponent {
    render() {
        const { tx, ty, x, y, opacity, backgroundColor, radius, ...props } = this.props;
        let transform;
        let zIndex = 0;
        let animation = {
            y: (Math.random() * 2 - 1) * 20 || 15,
            duration: 3000,
            delay:Math.random() * 1000,
            yoyo: true,
            repeat: -1,
        };
        if (tx && ty) {
            if (tx !== x && ty !== y) {
                const distance = getDistance({ x, y }, { x: tx, y: ty });
                const g = Math.sqrt(2000000 / (0.1 * distance * distance));
                transform = `translate(${g * (x - tx) / distance}px, ${g * (y - ty) / distance}px)`;
            } else if (tx === x && ty === y) {
                transform = `scale(${65 / radius})`;
                animation = { y: 0, yoyo: false, repeat: 0, duration: 300 };
                zIndex = 1;
            }
        }
        return (
            <div
                style={{
                    left: x - radius,
                    top: y - radius,
                    width: radius * 1.8,
                    height: radius * 1.8,
                    opacity,
                    zIndex,
                    transform,
                }}
                {...props}
            >
                <TweenOne
                    animation={animation}
                    style={{
                        backgroundColor,
                    }}
                    className={`${this.props.className}-child`}
                />
            </div>

        );
    }
}

class ProCountry extends React.Component{
    show=(e)=>{
        this.props.pfn(e);
    };
    render(){
        return(
            <Sider style={{overflow: 'auto',
                height: '100vh',
                left: 0,
                backgroundColor:"white",
                color:"black"
                }} width={230} >
            <Menu mode="inline"
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: '0',backgroundColor:"white" }}>
            <SubMenu key="sub1"  title="Country  List">
            {global.gl_country.map((pro)=>{
                return (
                    <Menu.Item key={pro} onClick={e=>{this.show(pro)}}>{pro}</Menu.Item>
                )
            })}
            </SubMenu>
            </Menu>
            </Sider>
        )
    }
}
