import React from "react";
import Link from "next/link";
import { Box, Button, Layer, Text } from "grommet";
import {
  Close,
  FacebookOption,
  Instagram,
  LinkedinOption,
  Pinterest,
  Twitter,
} from "grommet-icons";

import style from "../public/styles/Navbar.module.css";
const MobileNavMenu = ({ toggleMobileMenu }) => {
  return (
    <Layer full={true}>
      <Box pad={{ left: "32px", top: "25px", right: "20px" }}>
        <Box pad={{ bottom: "35px" }} direction="row">
          <Box width="350px" direction="row" justify="between" align="center">
            <a href="https://www.facebook.com/expatriant" target="_blank">
              <FacebookOption color="black" size="16px" />
            </a>
            <a href="https://www.instagram.com/expatriant_rus/" target="_blank">
              <Instagram color="black" size="14px" />
            </a>
            <a
              href="https://www.linkedin.com/company/expatriant"
              target="_blank"
            >
              <LinkedinOption color="black" size="18px" />
            </a>
            <a href="https://www.pinterest.com/expatriant/" target="_blank">
              <Pinterest color="black" size="18px" />
            </a>
            <a href="https://twitter.com/The_Expatriant" target="_blank">
              <Twitter color="black" size="18px" />
            </a>
          </Box>
          <Box
            width="53%"
            align="end"
            onClick={() => {
              toggleMobileMenu(false);
            }}
          >
            <Close color="black" size="28px" />
          </Box>
        </Box>
        <Box direction="column">
          <a
            className={style.NavAnchorTag}
            href="https://expatriant.com/russia/"
          >
            <Text className={style.NavLink} size="20px" color="black">
              Russia
            </Text>
          </a>
          <Box
            onClick={() => {
              toggleMobileMenu(false);
            }}
          >
            <a className={style.NavAnchorTag} href="/">
              <Text className={style.NavLink} size="20px" color="brand">
                Jobs
              </Text>
            </a>
          </Box>
          <a
            className={style.NavAnchorTag}
            href="https://expatriant.com/russia/residency/"
          >
            <Text className={style.NavLink} size="20px" color="black">
              Residency
            </Text>
          </a>
          <a
            className={style.NavAnchorTag}
            href="https://expatriant.com/russia/work/"
          >
            <Text className={style.NavLink} size="20px" color="black">
              Work
            </Text>
          </a>
          <a
            className={style.NavAnchorTag}
            href="https://expatriant.com/russia/education/"
          >
            <Text className={style.NavLink} size="20px" color="black">
              Education
            </Text>
          </a>
          <a
            className={style.NavAnchorTag}
            href="https://expatriant.com/russia/expat-life/"
          >
            <Text className={style.NavLink} size="20px" color="black">
              Expat Life
            </Text>
          </a>
          <a className={style.NavAnchorTag} href="https://expatriant.com/blog/">
            <Text className={style.NavLink} size="20px" color="black">
              Blog
            </Text>
          </a>
          <a
            className={style.NavAnchorTag}
            href="https://expatriant.com/about-us/"
          >
            <Text className={style.NavLink} size="20px" color="black">
              About Us
            </Text>
          </a>
          <a
            className={style.NavAnchorTag}
            href="https://expatriant.com/contact/"
          >
            <Text className={style.NavLink} size="20px" color="black">
              Contact
            </Text>
          </a>

          <Link href="/hire-expats">
            <Button
              primary
              size="large"
              label="Post Job"
              a11yTitle="Post a job"
              color="brand"
              onClick={() => {
                toggleMobileMenu(false);
              }}
            />
          </Link>
        </Box>
      </Box>
    </Layer>
  );
};

export default MobileNavMenu;
