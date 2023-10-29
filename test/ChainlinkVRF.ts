import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { ChainlinkVRF__factory } from "../typechain-types";

describe("ChainlinkVRF", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy() {

        const [owner, otherAccount] = await ethers.getSigners();

        const LinkToken = await ethers.getContractFactory("LinkToken");
        const linkToken = await LinkToken.deploy();

        const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
        const vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy("100000000000000000", 1000000000);

        const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
        const mockV3Aggregator= await MockV3Aggregator.deploy(18, 3000000000000000);

        const VRFV2Wrapper = await ethers.getContractFactory("VRFV2Wrapper");

        const vrfv2Wrapper = await VRFV2Wrapper.deploy(
            await linkToken.getAddress(), 
            await mockV3Aggregator.getAddress(),
            await vrfCoordinatorV2Mock.getAddress()
        );

        await vrfv2Wrapper.setConfig(
            60000,  52000,  10,
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
            10
        );

        await vrfCoordinatorV2Mock.fundSubscription(1, "10000000000000000000")

        //await vrfCoordinatorV2Mock.addConsumer(1, await vrfv2Wrapper.getAddress());

        const ChainlinkVRF = await ethers.getContractFactory("ChainlinkVRF");
        const chainlinkVRF = await ChainlinkVRF.deploy(await linkToken.getAddress(), await vrfv2Wrapper.getAddress());

        const chainlinkVRFAddress = await chainlinkVRF.getAddress()

        await linkToken.transfer(chainlinkVRFAddress, "1000000000000000000000000")

        return { chainlinkVRF, linkToken, chainlinkVRFAddress, vrfCoordinatorV2Mock, owner, otherAccount };
    }

    describe("Deployment", function () {

        it("Should be funded with links", async function () {
           
            const { linkToken, chainlinkVRFAddress, owner  } = await loadFixture(deploy);

            expect(await linkToken.balanceOf(chainlinkVRFAddress)).to.be.equal("1000000000000000000000000")

        });

        it("Should Request Random Numbers", async function () {
           
            const { chainlinkVRF, chainlinkVRFAddress, vrfCoordinatorV2Mock, owner } = await loadFixture(deploy);

            await chainlinkVRF.requestRandomWords(10000000, 3, 3);

            await vrfCoordinatorV2Mock.fulfillRandomWords(1, chainlinkVRFAddress)

            const latestBlock = await hre.ethers.provider.getBlock("latest")

            console.log(latestBlock?.number)

            await hre.network.provider.send("hardhat_mine", ["0x10"]);

            console.log((await hre.ethers.provider.getBlock("latest"))?.number)


            console.log(await chainlinkVRF.getRequestStatus(1))

            

        });


        // it("Should Request Random numbers", async function () {
        //     // We don't use the fixture here because we want a different deployment
        //     const { chainlinkVRF, linkToken, chainlinkVRFAddress, owner  } = await loadFixture(deploy);

     

        // });

    });


});
