import Header from '../header/Header';

const Layout = props => {
  return (
    <>
      <Header />
      <div className="box-main">
        <div className="box-border">
          <div className="box-content">{props.children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
