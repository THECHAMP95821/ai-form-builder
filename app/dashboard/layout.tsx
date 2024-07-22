import React, { ReactNode } from "react";
import { SignedIn } from "@clerk/nextjs";
import SideNav from "../_components/SideNav";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div>
            <SignedIn>
                <div>
                    <div className=" md:w-64 fixed"><SideNav/></div>
                    <div className="md:ml-64">{children}</div>
                    
                </div>
            </SignedIn>
        </div>
    );
};

export default DashboardLayout;
