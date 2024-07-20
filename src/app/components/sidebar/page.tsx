import Link from "next/link";
import Balance from "../../userBalance/page";
import Invested from "../../invested/page";
import "./sidebar.css";

const SideBar = () => {
    return(
        <div className="topbarContainer">
        <section className="title">
            <div className="Home">
            <Link href="/home" className="Assets">
                <h1>Satire Trade</h1>
            </Link>
            </div>
        </section>
        <div className="Options">
        <div className='Profile'>
            <Link href="/profile">Profile</Link>
          </div>
          <div className="Assets">
            <Link href="/assets" className="Assets">
              Assets
            </Link>
          </div>
          <div className="Trade">
            <Link href="/trade" className="Trade">
              Trade
            </Link>
          </div>
          <div className='strategies'>
            <Link href="/backtest">Strategies</Link>
          </div>
          <div className="Learn">
            <Link href="/components/construction" className="Learn">
              Whale Tracker
            </Link>
          </div>
          <div className='balance'>
            <Balance />
            <Invested />
          </div>
        </div>
      </div>
  );
}
export default SideBar;