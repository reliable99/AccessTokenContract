import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Access Controlled Token Test", function () {
    const contractFixture = async () => {
        const [owner] = await hre.ethers.getSigners();

        const AccessControlledToken = await hre.ethers.getContractFactory("AccessControlledToken");
        const accessControl = await AccessControlledToken.deploy();

        return { accessControl, owner };
    };

    it("Should mint as admin", async function () {

        const { accessControl } = await loadFixture(
            contractFixture
        );

        const addr1 = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30 "
        const addr2 = " 00x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"

        const newAdmin = await accessControl.addAdmin(addr1);
        await newAdmin.wait();
        const newAdmin2 = await accessControl.addAdmin(addr2);
        await newAdmin2.wait();

        const testMint = await accessControl.mint(addr1, 100);
        await testMint.wait();
        const testMint2 = await accessControl.mint(addr2, 100);
        await testMint2.wait();

        const userBalance = await accessControl.balanceOf(addr1);
        const userBalance2 = await accessControl.balanceOf(addr2);
        expect(userBalance).to.equal(100);
        expect(userBalance2).to.equal(100);
    });

    it("Should not mint if not admin", async function () {

        const { accessControl } = await loadFixture(
            contractFixture
        );

        const addr = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30"

        const mint = await accessControl.mint(addr, 100);
        await mint.wait();

        const userBalance = await accessControl.balanceOf(addr);
        expect(userBalance).to.revertedWith("Only admins can call this function");
    });



    it("Should check balance if not admin", async function () {
        const { accessControl, owner } = await loadFixture(
            contractFixture
        );

        const addr1 = " 0x2546BcD3c84621e976D8185a91A922aE77ECEc30"

        const admin = await accessControl.addAdmin(addr1);
        await admin.wait();

        const testMint = await accessControl.mint(addr1, 100);
        await testMint.wait();

        // await accessControl.connect(owner).balanceOf(addr1);
    });

    it("Should transfer as non-admin", async function () {

        const { accessControl, owner } = await loadFixture(
            contractFixture
        );

        const addr = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0 "
        // await accessControl.connect(owner).transfer(addr, 100);
        const balance = await accessControl.balanceOf(addr);
        expect(balance).to.equal(100);
    });
});