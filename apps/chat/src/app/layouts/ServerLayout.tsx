
import { Outlet } from 'react-router-dom';

const ServerLayout = () => {

  return (
    <div className='flex-row bg-bgSurface md:flex grow'>
      <Outlet />
    </div>
  )
}

export default ServerLayout;