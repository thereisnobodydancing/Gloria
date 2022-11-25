import { NIcon } from "naive-ui"

// 侧边栏通讯录
export const renderBuild = () => {
  return () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    class: 'w-5 h-5'
  },[
    h('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z'
    })
  ])
}

// 侧边栏日志
export const renderLog = () => {
  return () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    class: 'w-5 h-5'
  },[
    h('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
    })
  ])
}

// 侧边栏公告
export const renderBulletin = () => {
  return () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    class: 'w-5 h-5'
  },[
    h('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46'
    })
  ])
}

// 侧边栏审批中心
export const renderApproval = () => {
  return () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    class: 'w-5 h-5'
  },[
    h('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75'
    })
  ])
}

// 立方体
export const renderCube = () => {
  return () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    class: 'w-5 h-5'
  },[
    h('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9'
    })
  ])
}

export const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

export const renderPrefix = function (type, color=null) {
  // 公司
  if(type === 'company') {
    return () => h('div', {
      class: 'bg-primary/80 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center -ml-1'
    }, [
      h('svg', {
        xmlns: '#http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 1024 1024',
        strokeWidth: 'stroke-width',
        stroke: 'currentColor',
        class: 'w-4 h-4'
      }, [
        h('path', {
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          d: 'M961.5 700.5H889V512c0-24-19.5-43.5-43.5-43.5H541v-145h72.5c24 0 43.5-19.5 43.5-43.5V77c0-24-19.5-43.5-43.5-43.5h-203C386.5 33.5 367 53 367 77v203c0 24 19.5 43.5 43.5 43.5H483v145H178.5c-24 0-43.5 19.5-43.5 43.5v188.5H62.5C38.5 700.5 19 720 19 744v203c0 24 19.5 43.5 43.5 43.5h203c24 0 43.5-19.5 43.5-43.5V744c0-24-19.5-43.5-43.5-43.5H193v-174h290v174h-72.5c-24 0-43.5 19.5-43.5 43.5v203c0 24 19.5 43.5 43.5 43.5h203c24 0 43.5-19.5 43.5-43.5V744c0-24-19.5-43.5-43.5-43.5H541v-174h290v174h-72.5c-24 0-43.5 19.5-43.5 43.5v203c0 24 19.5 43.5 43.5 43.5h203c24 0 43.5-19.5 43.5-43.5V744c0-24-19.5-43.5-43.5-43.5zM425 91.5h174v174H425v-174zm-174 667v174H77v-174h174zm348 174H425v-174h174v174zm348 0H773v-174h174v174z',
          fill: '#fff'
        })
      ])
    ])
  }
  // 子部门
  if(type === 'sector') {
    return () => h('svg', {
      xmlns: '#http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 1024 1024',
      strokeWidth: 'stroke-width',
      stroke: 'currentColor',
      class: 'w-4 h-4'
    }, [
      h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        d: 'M961.5 700.5H889V512c0-24-19.5-43.5-43.5-43.5H541v-145h72.5c24 0 43.5-19.5 43.5-43.5V77c0-24-19.5-43.5-43.5-43.5h-203C386.5 33.5 367 53 367 77v203c0 24 19.5 43.5 43.5 43.5H483v145H178.5c-24 0-43.5 19.5-43.5 43.5v188.5H62.5C38.5 700.5 19 720 19 744v203c0 24 19.5 43.5 43.5 43.5h203c24 0 43.5-19.5 43.5-43.5V744c0-24-19.5-43.5-43.5-43.5H193v-174h290v174h-72.5c-24 0-43.5 19.5-43.5 43.5v203c0 24 19.5 43.5 43.5 43.5h203c24 0 43.5-19.5 43.5-43.5V744c0-24-19.5-43.5-43.5-43.5H541v-174h290v174h-72.5c-24 0-43.5 19.5-43.5 43.5v203c0 24 19.5 43.5 43.5 43.5h203c24 0 43.5-19.5 43.5-43.5V744c0-24-19.5-43.5-43.5-43.5zM425 91.5h174v174H425v-174zm-174 667v174H77v-174h174zm348 174H425v-174h174v174zm348 0H773v-174h174v174z',
        fill: color ? color : '#4b5563'
      })
    ])
  }
}









