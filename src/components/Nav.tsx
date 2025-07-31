import { Layout, Menu, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";
import { HomeOutlined, UserOutlined, ClockCircleOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

function Nav() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Layout className="min-h-screen">
            <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
                <div className="p-4">
                  <img 
                    src={logo} 
                    alt="Logo Chronos" 
                    className="w-32 mx-auto cursor-pointer" 
                    onClick={() => navigate('/')} 
                  />
                </div>
                <Menu mode="inline" theme="dark" defaultSelectedKeys={['home']}>
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        <Link to="/">Home</Link>
                    </Menu.Item>

                    {/* Menu do Manager */}
                    {user?.role === 'ROLE_MANAGER' && (
                        <Menu.Item key="employees" icon={<UserOutlined />}>
                            <Link to="/employees">Colaboradores</Link>
                        </Menu.Item>
                    )}

                    {/* Menu do Employee */}
                    {user?.role === 'ROLE_EMPLOYEE' && (
                        <Menu.Item key="points" icon={<ClockCircleOutlined />}>
                            <Link to="/my-points">Meus pontos</Link>
                        </Menu.Item>
                    )}
                </Menu>
            </Sider>
            <Layout>
               
                <Header className="bg-white px-6 flex justify-end items-center shadow-sm">
                <div className="flex items-center" style={{ gap: 20 }}>
                    <span className="mr-4 text-gray-700" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#fff' }}>Olá,</span>
                        <span style={{ marginLeft: 8, color: '#fff', fontWeight: 500 }}>{user?.name}</span>
                    </span>
                    <Button
                        type="primary"
                        icon={<LogoutOutlined />}
                        onClick={logout}
                        danger
                        style={{ marginLeft: 12 }}
                    >
                        Sair
                    </Button>
                </div>
               </Header>
                <Content className="m-4 lg:m-6">
                    <div className="p-6 min-h-full bg-white rounded-lg">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Nav;