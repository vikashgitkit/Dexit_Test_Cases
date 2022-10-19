const { expect, assert } = require("chai");
const { providers } = require("ethers");
const { ethers } = require("hardhat");

describe("BSC contract", function () {
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let addr5;
    let addr6;
    let addr7;
    let addr8;
    let addrs;
    let zeroAddress = `0x0000000000000000000000000000000000000000`;

    beforeEach(async function () {
        bscVali = await ethers.getContractFactory("BSCValidatorSet");
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, ...addrs] = await ethers.getSigners();
        
        bscValidatorSet = await bscVali.attach("0x0000000000000000000000000000000000001000");

        rewardRegi = await ethers.getContractFactory("RewardRegister");
        rewardReg = await rewardRegi.attach("0x0000000000000000000000000000000000002000");
        await bscValidatorSet.init();
    });

    /**************************Deposit***********************/
    describe("Deposit or Income", function () {
        it("Should Register the User", async function () {

            await rewardReg.connect(addr3).registerContract('0x5a0cd8Ca74EE599B6C6e495b59faE3A6c2663F03', '0x3217Fa90fA4A134F3476bbf2C9DE10A468401FD8');
            console.log("Registered....");

            await bscValidatorSet.connect(addr3).deposit('0x95eEcd42Ec27db6ea66c45c21289dA4D9092f475', ['0x5a0cd8Ca74EE599B6C6e495b59faE3A6c2663F03'], {
                value: ethers.utils.parseEther("20")
            });
        });

        it("Should Owner Claim the Income", async function () {

            await rewardReg.connect(addr3).registerContract('0x5a0cd8Ca74EE599B6C6e495b59faE3A6c2663F03', '0x3217Fa90fA4A134F3476bbf2C9DE10A468401FD8');
            console.log("Registered....");

            await bscValidatorSet.connect(addr3).deposit('0x95eEcd42Ec27db6ea66c45c21289dA4D9092f475', ['0x5a0cd8Ca74EE599B6C6e495b59faE3A6c2663F03'], {
                value: ethers.utils.parseEther("20")
            });

            //const trans = await bscValidatorSet.connect(addr1).transferRewardOwner();
            await bscValidatorSet.connect(addr3).claimOwnerReward();


            const valInfo4 = await rewardReg.rewardAmountOwner('0x814FCE56671f35267Cac924528355D4138Fd6c17');
            console.log("Owner reward:", valInfo4);

            expect(valInfo4).to.equal("00000000000000000000");

        });

        it("Should Validator Claim the Income", async function () {

            const valInfo1 = await bscValidatorSet.getValidatorInfo('0x814FCE56671f35267Cac924528355D4138Fd6c17');
            console.log("Before Val amt:",valInfo1[4]);
            
            await bscValidatorSet.connect(addr3).claimValidatorReward();

            const valInfo2 = await bscValidatorSet.getValidatorInfo('0x814FCE56671f35267Cac924528355D4138Fd6c17');
            console.log("After claim Val income:",valInfo1[4]);

        });

        it("Should Delegator Claim the Income", async function () {

            const delInfo1 = await bscValidatorSet.getStakingInfo('0xF906835a55E6F2aB86eEa3fC46ebde070e82A205','0x814FCE56671f35267Cac924528355D4138Fd6c17');
            console.log("Before Del amt:",delInfo1[4]);
            
            await bscValidatorSet.connect(addr4).claimDelegatorReward('0x814FCE56671f35267Cac924528355D4138Fd6c17');
        });

    });

});
