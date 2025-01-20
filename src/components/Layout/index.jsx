const Layout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-32 px-4">
      {children}
    </div>
  );
};

export default Layout;
