export default {
  pages: [
    {
      path: 'pages/index/index',
      style: {
        navigationBarTitleText: 'AICoach'
      }
    },
    {
      path: 'pages/login/index',
      style: {
        navigationBarTitleText: '登录'
      }
    },
    {
      path: 'pages/interview/index',
      style: {
        navigationBarTitleText: '模拟面试'
      }
    },
    {
      path: 'pages/resume/index',
      style: {
        navigationBarTitleText: '简历优化'
      }
    },
    {
      path: 'pages/courses/index',
      style: {
        navigationBarTitleText: '课程中心'
      }
    },
    {
      path: 'pages/profile/index',
      style: {
        navigationBarTitleText: '个人设置'
      }
    }
  ],
  tabBar: {
    color: '#999999',
    selectedColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'static/icons/home.png',
        selectedIconPath: 'static/icons/home-active.png'
      },
      {
        pagePath: 'pages/courses/index',
        text: '课程',
        iconPath: 'static/icons/courses.png',
        selectedIconPath: 'static/icons/courses-active.png'
      },
      {
        pagePath: 'pages/interview/index',
        text: '面试',
        iconPath: 'static/icons/interview.png',
        selectedIconPath: 'static/icons/interview-active.png'
      },
      {
        pagePath: 'pages/resume/index',
        text: '简历',
        iconPath: 'static/icons/resume.png',
        selectedIconPath: 'static/icons/resume-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'static/icons/profile.png',
        selectedIconPath: 'static/icons/profile-active.png'
      }
    ]
  },
  globalStyle: {
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF'
  }
}
