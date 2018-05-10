export default {
  data () {
    return {
      // 是否渲染为密码框
      ispwd: true,
      // 登录表单对象
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单验证规则
      loginFormRules: {
        // 用户名的校验规则
        username: [{ required: true, message: '请输入登录名', trigger: 'blur' }, { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }],
        // 登陆密码的校验规则
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击按钮重置表单项
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录的方法
    login () {
      // 先校验表单的合法性
      this.$refs.loginFormRef.validate(async valid => {
        // 表单验证失败！
        if (!valid) return this.$message.error('请填写完整的登录信息！')
        // 发起登录请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 登录失败
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // 把 登录成功后，服务器颁发的令牌，存储到 sessionStorage 中
        sessionStorage.setItem('token', res.data.token)
        // 通过 编程式导航 API，跳转到 后台 首页的 路由地址  /home
        this.$router.push('/home')
      })
    }
  }
}
