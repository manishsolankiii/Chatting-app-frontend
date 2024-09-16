import React from 'react'
import {Line,Doughnut} from "react-chartjs-2"
import   {CategoryScale, Chart as ChartJs,Tooltip,Filler,LinearScale,PointElement,LineElement,ArcElement,Legend, plugins, scales} from "chart.js"
import { orange, orangeLight, purple, purpleLight } from '../../Constants/Color';
import { getLast7Days } from '../../lib/features';


ChartJs.register(
 CategoryScale,Tooltip,Filler,LinearScale,PointElement,LineElement,ArcElement,Legend
);

const labels=getLast7Days();

const lineChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    },

    scales: {
        x:{
            grid:{
                display:false,
            },
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false,
            },
        },
    }
};

const LineChart = ({value=[]}) => {

    const data={
        labels:labels,
        datasets:[{
            data:value,
            label:"messages",
            fill:true,
            backgroundColor:purpleLight,
            borderColor:purple,
        }],
    }
  return (
    <Line data={data} options={lineChartOptions}/>
     
  )
}


const DoughnutOptions = {

    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    },
    cutout:100,
};

const DoughnutChart = ({value=[],labels=[]}) => {
    const data={
        labels,
        datasets:[{
            data:value,
            label:"Total Chats vs Group Chats",
            backgroundColor:[purpleLight,orangeLight],
            borderColor:[purple,orange],
            hoverBackgroundColor:[purple,orange],
            offset:40,
        }],
    }
    return <Doughnut style={{zIndex:10}} data={data} options={DoughnutOptions}/>


  }
export {LineChart,DoughnutChart}
