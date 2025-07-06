import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
const brownDark = "#4B2E20";
const brownMedium = "#6A4227";
const brownLight = "#8B5E3C";
const cream = "#F4EFEA";
const Footer = ({userCode, url}) => {
  console.log(url);
  
  return (
      <footer className=" bg-[#4B2E20] text-[#D9C4B2] py-8 mt-2 select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around text-center md:text-left gap-10 px-6">
          <div className=" flex-col space-y-2">
            <h4 className="font-semibold text-white text-lg tracking-wide">Contacts</h4>
            <p>(+237) 653 419 541</p>
            <p>(+237) 693 184 717</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white text-lg tracking-wide">Email Address</h4>
            <p>nkendzohaudrey@gmail.com</p>
            <h4 className="font-semibold mt-8 mb-3 text-white text-lg tracking-wide">Additional Info</h4>
            <p>Engineer in Topography and Cartography</p>
            <p>GIS, Remote Sensing</p>
          </div>
          {userCode && (
            <div className="flex flex-col items-center">
              <h4 className="font-semibold mb-3 text-white text-lg tracking-wide">Producer QR Code</h4>
              <QRCodeCanvas
                value={url || ""}
                size={120}
                bgColor={brownMedium}
                fgColor={cream}
                className="rounded-lg border-2 border-[#D9C4B2] shadow-md"
              />
            </div>
          )}
        </div>

        <div className="  text-center text-lg mt-10 opacity-100">
          <p>
            
          </p>
          &copy; 2025 Cocoa Trace by <span className="font-bold mx-2 text-white text-lg"> NkENDZOH </span> Cameroon. All rights reserved.
        </div>
      </footer>
  );
}

export default Footer
