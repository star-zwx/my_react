import React from 'react';  //导入‘react’文件里export的一个默认的组件
import {Button, Layout, Table, message, Menu,} from 'antd'; //导入antd文件中的button等组件
import {Tooltip as Tooltips} from 'antd';//导入antd文件中的Tooltip as Tooltips等组件
import { ExclamationCircleOutlined } from '@ant-design/icons';//导入@ant-design/icons文件中的ExclamationCircleOutlined组件
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label,Brush} from 'recharts';
import'./HomePage.css';     //导入同级文件夹中的css文件
import ProForm, {
    ModalForm,
    ProFormText,
} from '@ant-design/pro-form';//导入@ant-design/pro-form文件中的ModalForm,等组件
import { PlusOutlined } from '@ant-design/icons';
import TweenOne from 'rc-tween-one';
import { withRouter } from "react-router-dom";

// import Footer from "rc-table/es/Footer";
// import { createBrowserHistory } from 'history';
import {Link, NavLink} from "react-router-dom";

// const history = createBrowserHistory();
const { Header, Content,Footer } = Layout;  //  一个嵌套了header、content、footer的布局容器

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
let char_data=[];       //  声明数组char_data且仅在此代码块内有效

var columns = [
    {
        title: 'Number of meetings',
        dataIndex: 'service',
        className:'font1',
    },                          //用react和antd和table实现列表功能
    {
        title: 'Seat spacing',
        dataIndex: 'money',
        className:'font1',
    },
    {
        title: 'Venue width',
        dataIndex: 'card_number',
        className:'font1',
    },
    {
        title: 'Field curator',
        dataIndex: 'name',
        className:'font1',
    },
    {
        title: 'Number of possible patients',
        dataIndex: 'phone',
        className:'font1',
    },
    {
        title: 'Meeting schedule',
        dataIndex: 'phone',
        className:'font1',
    },{
        title: 'Meeting status',
        dataIndex: 'phone',
        className:'font1',
    },

];

var columns_2 = [
    {
        title: '单次交谈限制时间（秒）',  //新开，续卡
        dataIndex: 'service',
        className:'font2',
    },                         //用react和antd和table实现列表功能
    {
        title: '单次限制人数',
        dataIndex: 'money',
        className:'font2',
    },
    {
        title: '交谈率',
        dataIndex: 'card_number',
        className:'font2',
    },
    {
        title: '座位排数',
        dataIndex: 'name',
        className:'font2',
    },
    {
        title: '交谈距离',
        dataIndex: 'phone',
        className:'font2',
    },
    {
        title: '接触距离',
        dataIndex: 'project',
        className:'font2',
    },
    {
        title: '移动半径',
        dataIndex: 'shop_guide',
        className:'font2',
    },
    {
        title: '标尺横坐标位置',
        dataIndex: 'teacher',
        className:'font2',
    },
    {
        title: '标尺纵坐标位置',
        dataIndex: 'financial',        className:'font2',
    },
    {
        title: '口罩佩戴率',
        dataIndex: 'remarks1',        className:'font2',
    },
    {
        title: '疫苗接种率',
        dataIndex: 'collect_money',        className:'font2',
    },
    {
        title: '媒介感染因子',
        dataIndex: 'remarks2',        className:'font2',
    },
    {
        title: '基本感染率',
        dataIndex: 'remarks2',        className:'font2',
    },
    {
        title: '会议感染因子',
        dataIndex: 'remarks2',        className:'font2',
    },
    {
        title: '疫苗有效率',
        dataIndex: 'remarks2',        className:'font2',
    },


];



class HomePage extends React.Component{
    state = {
        showInfoDialog: false, //显示添加对话框
        editingItem: null, //对话框编辑的内容
        mData: [], //table里的数据
        show_back: "none", //是否显示“back”
    };

    static defaultProps = {
        className: 'linked-animate-demo',
    };

    num = 50;// 点的个数



    onMouseMove = (e) => {
        const cX = e.clientX;
        const cY = e.clientY;
        const boxRect = this.box.getBoundingClientRect();
        const pos = this.state.data.map((item) => {
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


    constructor(props) {
        super(props);
        this.state = {
            chenpin:[
                {
                    title:"",
                    content:"",
                    img:"",
                    char_data:[]
                }

            ],
            data: getPointPos(1500, 1050, this.num).map(item => ({
                ...item,
                opacity: Math.random() * 0.2 + 0.05,
                backgroundColor: `rgb(${Math.round(Math.random() * 95 + 160)},255,255)`,
            })),
            tx: 0,
            ty: 0,
        }
    }

    draw_chart=()=>{
        fetch("http://127.0.0.1:8000/back/",{
            method:"post",
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-type':'application/x-www-form-urlencoded'
            },
            body:" "
        })
            .then(res =>{
                return res.text()
            })
            .then(data => {
                // console.log(data);
                let data0=data.split("]");
                // console.log(Object.prototype.toString.call(data0));
                let data01=data0[0].replace(/\[/g,'');
                // console.log(data01);
                let data02=data01.split("}},");
                let temp,a=[];
                // console.log(JSON.parse(data02));
                for (let i=0;i<data02.length;i++){
                    if(i!==data02.length-1){
                        temp=data02[i]+"}}"
                    }
                    a[i]=JSON.parse(temp).fields
                }
                console.log(a[a.length-1]);
                this.setState({
                    char_data:a
                })
            })
    };

    toH(){
        this.props.history.push('/');
    }
    render(){
        const pathname = this.props.history.location.pathname;
        const { className } = this.props;
        const { data, tx, ty } = this.state;
        let defaulS = [];
        defaulS.push(pathname);
        console.log(defaulS);
        return (
            <div className={`${className}-wrapper`}>
                <div
                    className={`${className}-box`}
                    ref={(c) => { this.box = c; }}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={this.onMouseLeave}
                >
                    {data.map((item, i) => (
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
                    <Layout className={'aa'}>
                        <Content > {/* style={{"border":"solid red"}} */}
                            <div style={{ background: '00909e', padding: 1, paddingTop:4, minHeight: 0 }}>
                                <div style={{position:"absolute",left:"20px",top:"70px",height:"100px",width:"20px"}}>
                                    <h1 style={{fontSize:"15px",paddingTop:10,color:'white'}}>Variation parameters</h1>
                                </div>
                                <ModalForm
                                    title="Enter a new set of data"
                                    trigger={
                                        <Button type="primary" style={{position:"absolute", right:"1.3%", top:"7%",backgroundColor:'#11cbd7',border:'#11cbd7 solid'}}>
                                            <PlusOutlined />
                                            Add
                                        </Button>
                                    }
                                    modalProps={{
                                        onCancel: () => console.log('run'),
                                    }}
                                    onFinish={async (values) => {
                                        await waitTime(1000);
                                        console.log(JSON.stringify(values));
                                        await fetch("http://127.0.0.1:8000/hello/", {
                                            method: "post",
                                            headers: {
                                                'Accept':'application/json',
                                                'Content-Type':'application/json',
                                            },
                                            body:JSON.stringify(values)
                                        });
                                        message.success('Submitted successfully');
                                        return true;
                                    }}
                                >
                                    <ProForm.Group>
                                        <ProFormText width="md" name="a" label="Number of meetings" placeholder="100"/>
                                        <ProFormText width="md" name="b" label="Seat spacing" placeholder="1"/>
                                        <ProFormText width="md" name="c" label="Venue width" placeholder="50"/>
                                        <ProFormText width="md" name="d" label="Field curator" placeholder="50"/>
                                        <ProFormText width="md" name="e" label="Number of possible patients" placeholder="3"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                        <ProFormText width="420px" name="f" label="Meeting schedule" placeholder="['09:00:00','10:00:00','10:30:00','12:00:00','14:00:00','16:00:00']"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                    <ProFormText width="md" name="g" label="Meeting status" placeholder="[0, 1, 0, 1, 0]"/>
                                    </ProForm.Group>
                                </ModalForm>
                                <Table  style={{width:"80%",margin:"auto"}}
                                        columns={columns}
                                    // dataSource={data}
                                        pagination={{ pageSize: 20 }}
                                        scroll={{ y: 0 }}/>
                            </div>
                            <div className={'aa_1'} style={{padding: 1, minHeight: 0 }}>
                                数据显示框
                                <ModalForm
                                    title="Enter a new set of data"
                                    trigger={
                                        <Button type="primary" style={{position:"absolute",right:"1.3%",top:"11%",backgroundColor:'#11cbd7',border:'#11cbd7 solid'}}>
                                            <PlusOutlined />
                                            Add
                                        </Button>
                                    }
                                    modalProps={{
                                        onCancel: () => console.log('run'),
                                    }}
                                    onFinish={async (values) => {
                                        await waitTime(1500);
                                        console.log(JSON.stringify(values));
                                        await fetch("http://127.0.0.1:8000/hello/", {
                                            method: "post",
                                            headers: {
                                                'Accept':'application/json',
                                                'Content-Type':'application/json',
                                            },
                                            body:JSON.stringify(values)
                                        });
                                        message.success('Submitted successfully');
                                        return true;
                                    }}
                                >
                                    <ProForm.Group>
                                        <ProFormText width="md" name="i" label="Limit time of single conversation (seconds)" placeholder="480"/>
                                        <ProFormText width="md" name="j" label="Conversation limit" placeholder="3"/>
                                        <ProFormText width="md" name="k" label="Conversation rate" placeholder="0.3"/>
                                        <ProFormText width="md" name="l" label="Movement rate" placeholder="0.3"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                        <ProFormText width="md" name="m" label="Number of seat rows" placeholder="10"/>
                                        <ProFormText width="md" name="n" label="Conversation distance" placeholder="0.5"/>
                                        <ProFormText width="md" name="o" label="contact distance" placeholder="1"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                        <ProFormText width="md" name="p" label="Moving radius" placeholder="0.3"/>
                                        <ProFormText width="md" name="q" label="Scale abscissa position" placeholder="10"/>
                                        <ProFormText width="md" name="r" label="Ruler ordinate position" placeholder="10"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                        <ProFormText width="md" name="s" label="Mask wearing rate" placeholder="0.7"/>
                                        <ProFormText width="md" name="t" label="Vaccination rate" placeholder="0.7"/>
                                        <ProFormText width="md" name="u" label="Vector infection factor" placeholder="0.2"/>
                                        <ProFormText width="md" name="v" label="Basic infection rate" placeholder="0.7"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                        <ProFormText width="md" name="w" label="Conference infection factor" placeholder="0.3"/>
                                        <ProFormText width="md" name="x" label="Vaccine efficiency" placeholder="0.75"/>
                                        <ProFormText width="md" name="y" label="Meeting time step" placeholder="4"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                        <ProFormText width="md" name="z" label="Infectious factors of susceptible persons wearing masks" placeholder="0.33"/>
                                        <ProFormText width="md" name="A" label="Infectious factors of communicators wearing masks" placeholder="0.056"/>
                                    </ProForm.Group>
                                    <ProForm.Group>
                                        <ProFormText width="md" name="B" label="Both parties wear masks and infection factors" placeholder="0.017"/>
                                        <ProFormText width="md" name="C" label="Contact time control factor" placeholder="120"/>
                                    </ProForm.Group>



                                </ModalForm>


                            </div>
                            <div style={{padding: 1.5, minHeight: 0 }}>

                                <ModalForm
                                    title="Enter a new set of data"

                                    modalProps={{
                                        onCancel: () => console.log('run'),
                                    }}
                                    onFinish={async (values) => {
                                        await waitTime(800);
                                        console.log(JSON.stringify(values));
                                        await fetch("http://127.0.0.1:8000/hello/", {
                                            method: "post",
                                            headers: {
                                                'Accept':'application/json',
                                                'Content-Type':'application/json',
                                            },
                                            body:JSON.stringify(values)
                                        });
                                        message.success('Submitted successfully');
                                        fetch("http://127.0.0.1:8000/back/",{
                                            method:"post",
                                            headers:{
                                                'Accept': 'application/json, text/plain, */*',
                                                'Content-type':'application/x-www-form-urlencoded'
                                            },
                                            body:" "
                                        })
                                            .then(res =>{
                                                return res.text()
                                            })
                                            .then(data => {
                                                // console.log(data);
                                                let data0=data.split("]");
                                                // console.log(Object.prototype.toString.call(data0));
                                                let data01=data0[0].replace(/\[/g,'');
                                                // console.log(data01);
                                                let data02=data01.split("}},");
                                                let temp,a=[];
                                                // console.log(JSON.parse(data02));
                                                for (let i=0;i<data02.length;i++){
                                                    if(i!==data02.length-1){
                                                        temp=data02[i]+"}}"
                                                    }
                                                    a[i]=JSON.parse(temp).fields
                                                }
                                                console.log(a[a.length-1]);
                                                this.setState({
                                                    char_data:a
                                                })
                                            })
                                        return true;

                                    }}
                                >

                                </ModalForm>

                            </div>
                        </Content>
                        {/*<Button size={"large"} type={"primary"} style={{width:"20%",margin:"1% auto",backgroundColor:'#11cbd7',border:'#11cbd7 solid'}} onClick={this.draw_chart.bind(this)}>显示图像</Button>*/}
                        <div className={'char_mid1'}><LineChart
                            className={'char_mid2'}
                            width={1000}
                            height={600}
                            data={this.state.char_data}
                            margin={{
                                top: 5,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" label={{value:'date', position:"insideBottom"}} />
                            {/*<YAxis />*/}
                            <YAxis label={{ value: 'the number of people', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Brush height={15}/>
                            <Legend verticalAlign={"top"}/>
                            <Line type="monotone" dataKey="death" stroke="#FF3030" activeDot={{ r: 8 }} name={"Death"}/>
                            <Line type="monotone" dataKey="a" stroke="#FFEC8B" name={"Asymptomatic"}/>
                            <Line type="monotone" dataKey="s" stroke="#FF99AC" name={"Susceptible person"}/>
                            <Line type="monotone" dataKey="in_field" stroke="#6495FF" name={"Symptomatic"}/>
                            <Line type="monotone" dataKey="is_field" stroke="#32454F" name={"Isolators"}/>
                            <Line type="monotone" dataKey="r" stroke="#8B8989" name={"Recovery"}/>
                            <Line type="monotone" dataKey="c" stroke="#9D574f" name={"confirm"}/>
                            <Line type="monotone" dataKey="h" stroke="#9400D3" name={"Hide"}/>
                            <Line type="monotone" dataKey="total" stroke="#D02090" name={"Total"}/>
                        </LineChart></div>
                    </Layout>
                    <Footer className={'bb'} style={{ textAlign: 'center'}}>
                        地址：天津市西青区宾水西道399号
                        <br />
                        邮编：300387
                    </Footer>
                </Layout>
            </div>
        );
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
    const radiusArray = [20, 35, 60];
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
                transform = `scale(${80 / radius})`;
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

// class LinkedAnimate extends React.Component {
//
//     render() {
//         return (
//
//
//
//         );
//     }
// }
//
// ReactDOM.render(
//
//     , mountNode);

export default HomePage;
