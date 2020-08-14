import { useState } from "react";

import { Box, Button, Image, Nav, Header, Text } from "grommet";

import { Menu, Add } from "grommet-icons";

import Link from "next/link";
import logo from "../public/img/expatriant_logo.png";
import MobileNavMenu from "./MobileNavMenu";

import style from "../public/styles/Navbar.module.css";

const Navbar = ({ size }) => {
  const [mobileOpen, toggleMobileMenu] = useState(false);
  const responsiveNav =
    size !== "small" ? (
      <Header
        elevation="small"
        direction="row"
        justify="evenly"
        align="center"
        height={size === "small" ? "50px" : "80px"}
      >
        <Link href="/">
          <Box
            height={size === "small" ? "50px" : "75px"}
            width={size === "small" ? "50px" : "75px"}
            margin={{ right: "15px" }}
          >
            <Image fit="cover" src={logo} />
          </Box>
        </Link>
        <Box fill="vertical" direction="row">
          <ul className={style.ListFormat}>
            <li className={style.ActiveTab}>
              <Link href="/">
                <Box
                  fill="vertical"
                  justify="center"
                  pad={{ left: "15px", right: "15px" }}
                >
                  <Text
                    className={style.NavLink}
                    size={size === "small" ? "12px" : "14px"}
                    color="black"
                  >
                    Jobs
                  </Text>
                </Box>
              </Link>
            </li>
            <li className={style.UnderlineAnimation}>
              <a
                className={style.NavAnchorTag}
                href="https://expatriant.com/russia/residency/"
              >
                <Box
                  fill="vertical"
                  justify="center"
                  pad={{ left: "15px", right: "15px" }}
                >
                  <Text
                    className={style.NavLink}
                    size={size === "small" ? "12px" : "14px"}
                    color="black"
                  >
                    Residency
                  </Text>
                </Box>
              </a>
            </li>
            <li className={style.UnderlineAnimation}>
              <a
                className={style.NavAnchorTag}
                href="https://expatriant.com/russia/residency/"
              >
                <Box
                  fill="vertical"
                  justify="center"
                  pad={{ left: "15px", right: "15px" }}
                >
                  <Text
                    className={style.NavLink}
                    size={size === "small" ? "12px" : "14px"}
                    color="black"
                  >
                    About Us
                  </Text>
                </Box>
              </a>
            </li>
            <li className={style.UnderlineAnimation}>
              <a
                className={style.NavAnchorTag}
                href="https://expatriant.com/contact/"
              >
                <Box
                  fill="vertical"
                  justify="center"
                  pad={{ left: "15px", right: "15px" }}
                >
                  <Text
                    className={style.NavLink}
                    size={size === "small" ? "12px" : "14px"}
                    color="black"
                  >
                    Contact
                  </Text>
                </Box>
              </a>
            </li>
          </ul>

          <Box justify="center">
            <Link href="/hire-expats">
              <Button
                hoverIndicator="string"
                size={size}
                label="Post Job"
                a11yTitle="Post a job"
                color="brand"
                primary={true}
              />
            </Link>
          </Box>
        </Box>
      </Header>
    ) : (
      <>
        <Header elevation="small" height="55px">
          <Box
            fill={true}
            gap="xlarge"
            direction="row"
            align="center"
            justify="between"
            margin={{ left: "15px", right: "15px" }}
          >
            <Box
              width="35px"
              height="35px"
              align="center"
              justify="center"
              onClick={() => {
                toggleMobileMenu(true);
              }}
            >
              <Menu size="26px" color="brand" />
            </Box>
            <Link href="/">
              <Box height="48px" width="48px">
                <Image fit="cover" src={logo} />
              </Box>
            </Link>
            <Link href="/hire-expats">
              <Box width="35px" height="35px" align="center" justify="center">
                <Add color="brand" a11yTitle="Post a job" />
              </Box>
            </Link>
          </Box>
        </Header>
        {mobileOpen && (
          <MobileNavMenu
            mobileOpen={mobileOpen}
            toggleMobileMenu={toggleMobileMenu}
            size={size}
          />
        )}
      </>
    );
  return responsiveNav;
};

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default React.memo(Navbar, areEqual);
