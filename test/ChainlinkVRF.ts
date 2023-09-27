import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainlinkVRF__factory } from "../typechain-types";

describe("ChainlinkVRF", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy() {

        const [owner, otherAccount] = await ethers.getSigners();

        const Links = await ethers.getContractFactory("LinksMock");
        const links = await Links.deploy();

        const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
        const vRFCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(1, 1);

        const linkAddress = await links.getAddress();
        const wrapperAddress = await vRFCoordinatorV2Mock.getAddress();

        const ChainlinkVRF = await ethers.getContractFactory("ChainlinkVRF");
        const chainlinkVRF = await ChainlinkVRF.deploy(linkAddress, wrapperAddress);

        const chainlinkVRFAddress = await chainlinkVRF.getAddress()

        // send links to contract

        links.transfer((await chainlinkVRF.getAddress()), 100000000)

        return { chainlinkVRF, links, chainlinkVRFAddress, linkAddress, wrapperAddress, owner, otherAccount };
    }

    describe("Deployment", function () {

        it("Should set the right linkAddress, wrapperAddress and owner", async function () {
            const { chainlinkVRF, linkAddress, wrapperAddress, owner } = await loadFixture(deploy);

            expect(await chainlinkVRF.linkAddress()).to.equal(linkAddress);
            expect(await chainlinkVRF.wrapperAddress()).to.equal(wrapperAddress);
            expect(await chainlinkVRF.owner()).to.equal(owner.address);

        });


        it("Should be funded with links", async function () {
            const { chainlinkVRF, links  } = await loadFixture(deploy);

            console.log(await links.balanceOf(await chainlinkVRF.getAddress()))

            expect((await links.balanceOf(await chainlinkVRF.getAddress())) > 0)
   
        });

        // it("Should fail if the unchainlinkVRFTime is not in the future", async function () {
        //     // We don't use the fixture here because we want a different deployment
        //     const latestTime = await time.latest();
        //     const chainlinkVRF = await ethers.getContractFactory("chainlinkVRF");
        //     await expect(chainlinkVRF.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        //         "UnchainlinkVRF time should be in the future"
        //     );
        // });

    });

    describe("Withdrawals", function () {

        describe("Validations", function () {

            // it("Should revert with the right error if called too soon", async function () {
            //     const { chainlinkVRF } = await loadFixture(deploy);


            // });

            // it("Should revert with the right error if called from another account", async function () {
            //     const { chainlinkVRF,  } = await loadFixture(deploy);

            // });

            // it("Shouldn't fail if the unchainlinkVRFTime has arrived and the owner calls it", async function () {
            //     const { chainlinkVRF } = await loadFixture(deploy);

            // });
        
        });

        describe("Events", function () {
            // it("Should emit an event on withdrawals", async function () {
            //     const { chainlinkVRF } = await loadFixture(deploy);
            // });
        });

        describe("Transfers", function () {
            // it("Should transfer the funds to the owner", async function () {
            //     const { chainlinkVRF, owner } = await loadFixture(deploy);


            // });
        });
    });

});
