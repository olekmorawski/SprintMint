import Header from '../components/Header.jsx'
import React from 'react'

const NFTPreviev = () => {
  return (
    <>
      <Header />

      <div className="under_header">
        <div className="main_box_nft">
          <div className="under_text">
            <p className="p1">YOUR NFT HAS BEEN</p>

            <p className="p2">CREATED!</p>
          </div>
          <div className="nftbox">
            <div className="left">
              <div className="picture"></div>
              <div className="picturedesdiv">
                <p className="picturedes">Big Bro</p>
              </div>
            </div>
            <div className="right">
              <div className="upper">
                <div className="head">
                  <p>Description</p>
                </div>
                <div className="des">
                  <p>
                    "Big Bro" is a captivating NFT that blends artistry and
                    technology. This digital masterpiece explores the themes of
                    surveillance and privacy in our modern world. Its striking
                    imagery, meticulous detailing, and thought-provoking
                    symbolism make it a must-have for collectors. Join the
                    conversation on digital art and technology's impact by
                    owning "Big Bro" today.
                  </p>
                </div>
              </div>

              <div className="down">
                <div className="box">
                  <p className="p1">Type: </p> <p className="p2">&nbsp;name</p>
                </div>
                <div className="box">
                  <p className="p1">Prettiness: </p>
                  <p className="p2">&nbsp;10/10</p>
                </div>
                <div className="box">
                  <p className="p1">Animal: </p>
                  <p className="p2">&nbsp;bear</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NFTPreviev
