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
        bscValidatorSet = await bscVali.deploy();
        await bscValidatorSet.init();

        votingDep = await ethers.getContractFactory("GovHub");
        votingSet = await votingDep.deploy();
        // await bscValidatorSet.init();
    });

    /**********************Init() Method**********************/
    describe("For init", function () {
        it("Address should not empty", async function () {
            //console.log("Address of bsc", bscValidatorSet.address);
            expect(await bscValidatorSet.address).not.be.empty;
        });
        it("Misdemeanor Threshold should 50", async function () {
            expect(await bscValidatorSet.misdemeanorThreshold()).to.equal(2);
        });

        it("Felony Threshold should 150", async function () {
            expect(await bscValidatorSet.felonyThreshold()).to.equal(4);
        });

        it("Maximum Validator should 4", async function () {
            expect(await bscValidatorSet.MaxValidators()).to.equal(4);
        });

        it("Minimum Stake amount", async function () {
            const min = await bscValidatorSet.minimumStakeAmount();
            expect(min + "").to.equal("10000000000000000000");
        });
        // it("Proposal Lasting period", async function () {
        //     expect(await bscValidatorSet.proposalLastingPeriod()).to.equal(3000);
        // });

    });

    /**************************Voting*************************/
    describe("For Creating Proposal", function () {
        it("Only Validator Should Create Proposal", async function () {
            await bscValidatorSet.connect(addr1).stakeValidator({
                value: ethers.utils.parseEther("20"),
            })
            await bscValidatorSet.connect(addr2).stakeValidator({
                value: ethers.utils.parseEther("15"),
            })
            await bscValidatorSet.connect(addr3).stakeValidator({
                value: ethers.utils.parseEther("25"),
            })
            await bscValidatorSet.connect(addr4).stakeValidator({
                value: ethers.utils.parseEther("30"),
            })
            await bscValidatorSet.connect(addr5).stakeValidator({
                value: ethers.utils.parseEther("35"),
            })
            await bscValidatorSet.connect(addr6).stakeValidator({
                value: ethers.utils.parseEther("12"),
            })
            const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo[1]).to.equal(2); 

            await expect(votingSet.connect(addr8).createProposal("Changing Max Validators", "MaxValidators", 5, {
                value: ethers.utils.parseEther("1"),
            })).to.be.reverted;
        });

        it("UnStaked Validator Should Not Create Proposal", async function () {
            await bscValidatorSet.connect(addr1).stakeValidator({
                value: ethers.utils.parseEther("20"),
            })
            await bscValidatorSet.connect(addr2).stakeValidator({
                value: ethers.utils.parseEther("15"),
            })
            await bscValidatorSet.connect(addr3).stakeValidator({
                value: ethers.utils.parseEther("25"),
            })
            await bscValidatorSet.connect(addr4).stakeValidator({
                value: ethers.utils.parseEther("30"),
            })
            await bscValidatorSet.connect(addr5).stakeValidator({
                value: ethers.utils.parseEther("35"),
            })

            const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo[1]).to.equal(2); 

            await bscValidatorSet.connect(addr1).unstakeValidator();
            const valInfo2 = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo2[1]).to.equal(3); 

            await expect(votingSet.connect(addr1).createProposal("Validator is UnStaked", "MaxValidators", 5, {
                value: ethers.utils.parseEther("1"),
            })).to.be.reverted;

        });

        it("Validator Should Revert If He Takes Other String Than MaxValidator or minimumStakeAmount", async function () {
            await bscValidatorSet.connect(addr1).stakeValidator({
                value: ethers.utils.parseEther("20"),
            })
            await bscValidatorSet.connect(addr2).stakeValidator({
                value: ethers.utils.parseEther("15"),
            })
            await bscValidatorSet.connect(addr3).stakeValidator({
                value: ethers.utils.parseEther("25"),
            })
            await bscValidatorSet.connect(addr4).stakeValidator({
                value: ethers.utils.parseEther("30"),
            })
            await bscValidatorSet.connect(addr5).stakeValidator({
                value: ethers.utils.parseEther("35"),
            })

            const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo[1]).to.equal(2); 

            await expect(votingSet.connect(addr1).createProposal("Type other string", "wrong", 6, {
                value: ethers.utils.parseEther("1"),
            })).to.be.reverted;

        });

        it("Validator Must Pay 1 DXT For Creating Proposal", async function () {
            await bscValidatorSet.connect(addr1).stakeValidator({
                value: ethers.utils.parseEther("20"),
            })
            await bscValidatorSet.connect(addr2).stakeValidator({
                value: ethers.utils.parseEther("15"),
            })
            await bscValidatorSet.connect(addr3).stakeValidator({
                value: ethers.utils.parseEther("25"),
            })
            await bscValidatorSet.connect(addr4).stakeValidator({
                value: ethers.utils.parseEther("30"),
            })
            await bscValidatorSet.connect(addr5).stakeValidator({
                value: ethers.utils.parseEther("35"),
            })
            await bscValidatorSet.connect(addr6).stakeValidator({
                value: ethers.utils.parseEther("12"),
            })
            const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo[1]).to.equal(2); 

            await expect(votingSet.connect(addr6).createProposal("Must pay 1 DXT", "minimumStakeAmount", 20, {
                value: ethers.utils.parseEther("2"),
            })).to.be.reverted;

        });

        it("Validator Should Create Proposal For MaxValidators", async function () {
            await bscValidatorSet.connect(addr1).stakeValidator({
                value: ethers.utils.parseEther("20"),
            })
            await bscValidatorSet.connect(addr2).stakeValidator({
                value: ethers.utils.parseEther("15"),
            })
            await bscValidatorSet.connect(addr3).stakeValidator({
                value: ethers.utils.parseEther("25"),
            })
            await bscValidatorSet.connect(addr4).stakeValidator({
                value: ethers.utils.parseEther("30"),
            })
            await bscValidatorSet.connect(addr5).stakeValidator({
                value: ethers.utils.parseEther("35"),
            })

            const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo[1]).to.equal(2); 

            await expect(votingSet.connect(addr1).createProposal("Changing Max Validators", "MaxValidators", 5, {
                value: ethers.utils.parseEther("1"),
            }))

        });

        it("Validator Should Create Proposal For MinimumStakeAmount", async function () {
            await bscValidatorSet.connect(addr1).stakeValidator({
                value: ethers.utils.parseEther("20"),
            })
            await bscValidatorSet.connect(addr2).stakeValidator({
                value: ethers.utils.parseEther("15"),
            })
            await bscValidatorSet.connect(addr3).stakeValidator({
                value: ethers.utils.parseEther("25"),
            })
            await bscValidatorSet.connect(addr4).stakeValidator({
                value: ethers.utils.parseEther("30"),
            })
            await bscValidatorSet.connect(addr5).stakeValidator({
                value: ethers.utils.parseEther("35"),
            })
            await bscValidatorSet.connect(addr6).stakeValidator({
                value: ethers.utils.parseEther("12"),
            })
            const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo[1]).to.equal(2); 

            await expect(votingSet.connect(addr6).createProposal("Changing Minimum Stake Amount", "minimumStakeAmount", 8, {
                value: ethers.utils.parseEther("1"),
            }))
        });
    });

    describe("For Do Voting On Proposal", function () {
        it("Other Than HighestValidator Should Not Do Vote", async function () {
            await bscValidatorSet.connect(addr1).stakeValidator({
                value: ethers.utils.parseEther("20"),
            })
            await bscValidatorSet.connect(addr2).stakeValidator({
                value: ethers.utils.parseEther("15"),
            })
            await bscValidatorSet.connect(addr3).stakeValidator({
                value: ethers.utils.parseEther("25"),
            })
            await bscValidatorSet.connect(addr4).stakeValidator({
                value: ethers.utils.parseEther("30"),
            })
            await bscValidatorSet.connect(addr5).stakeValidator({
                value: ethers.utils.parseEther("35"),
            })
            await bscValidatorSet.connect(addr6).stakeValidator({
                value: ethers.utils.parseEther("12"),
            })
            const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
            expect(valInfo[1]).to.equal(2);
            expect(valInfo[2].toString()).to.equal("20000000000000000000");

            await expect(votingSet.connect(addr3).createProposal("Changing Max Validators", "MaxValidators", 5, {
                value: ethers.utils.parseEther("1"),
            }))

            const propose = await votingSet.chcekProposal();
            console.log("Check Proposal Id", propose[0]);
            console.log("Prpose len:", propose.length)
            expect(propose.length).to.equal(1);
            await expect(votingSet.connect(addr6).voteProposal(propose[0], "true")).to.be.reverted;
        });

        // it("Validator Should Not Do Vote Apart From True Or False", async function () {
        //     await bscValidatorSet.connect(addr1).stakeValidator({
        //         value: ethers.utils.parseEther("20"),
        //     })
        //     await bscValidatorSet.connect(addr2).stakeValidator({
        //         value: ethers.utils.parseEther("15"),
        //     })
        //     await bscValidatorSet.connect(addr3).stakeValidator({
        //         value: ethers.utils.parseEther("25"),
        //     })
        //     await bscValidatorSet.connect(addr4).stakeValidator({
        //         value: ethers.utils.parseEther("30"),
        //     })
        //     await bscValidatorSet.connect(addr5).stakeValidator({
        //         value: ethers.utils.parseEther("35"),
        //     })
        //     await bscValidatorSet.connect(addr6).stakeValidator({
        //         value: ethers.utils.parseEther("12"),
        //     })
        //     const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
        //     expect(valInfo[1]).to.equal(2); 

        //     await bscValidatorSet.connect(addr3).createProposal("Changing Max Validators", "MaxValidators", 5, {
        //         value: ethers.utils.parseEther("1"),
        //     })
        //     const propose = await bscValidatorSet.checkProposal();
        //    // console.log("Check Proposal Id", propose[0]);
        //     expect(propose.length).to.equal(1);

        //     await expect(bscValidatorSet.connect(addr6).voteProposal(propose[0], "Wrong")).to.be.reverted;
        // });

        // it("Only Highest Validator Can Do Vote", async function () {
        //     await bscValidatorSet.connect(addr1).stakeValidator({
        //         value: ethers.utils.parseEther("20"),
        //     })
        //     await bscValidatorSet.connect(addr2).stakeValidator({
        //         value: ethers.utils.parseEther("15"),
        //     })
        //     await bscValidatorSet.connect(addr3).stakeValidator({
        //         value: ethers.utils.parseEther("25"),
        //     })
        //     await bscValidatorSet.connect(addr4).stakeValidator({
        //         value: ethers.utils.parseEther("30"),
        //     })
        //     await bscValidatorSet.connect(addr5).stakeValidator({
        //         value: ethers.utils.parseEther("35"),
        //     })
        //     await bscValidatorSet.connect(addr6).stakeValidator({
        //         value: ethers.utils.parseEther("12"),
        //     })
        //     const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
        //     expect(valInfo[1]).to.equal(2); 

        //     await bscValidatorSet.connect(addr3).createProposal("Changing Max Validators", "MaxValidators", 5, {
        //         value: ethers.utils.parseEther("1"),
        //     })
        //     const propose = await bscValidatorSet.checkProposal();
        //    // console.log("Check Proposal Id", propose[0]);
        //     expect(propose.length).to.equal(1);

        //     await bscValidatorSet.connect(addr5).voteProposal(propose[0], "true");
        // });

        // it("Validator Can Do Vote Even if he in unstaked status after creating proposal", async function () {
        //     await bscValidatorSet.connect(addr1).stakeValidator({
        //         value: ethers.utils.parseEther("20"),
        //     })
        //     await bscValidatorSet.connect(addr2).stakeValidator({
        //         value: ethers.utils.parseEther("15"),
        //     })
        //     await bscValidatorSet.connect(addr3).stakeValidator({
        //         value: ethers.utils.parseEther("25"),
        //     })
        //     await bscValidatorSet.connect(addr4).stakeValidator({
        //         value: ethers.utils.parseEther("30"),
        //     })
        //     await bscValidatorSet.connect(addr5).stakeValidator({
        //         value: ethers.utils.parseEther("35"),
        //     })
        //     await bscValidatorSet.connect(addr6).stakeValidator({
        //         value: ethers.utils.parseEther("12"),
        //     })
        //     const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
        //     expect(valInfo[1]).to.equal(2); 

        //     await bscValidatorSet.connect(addr3).createProposal("Changing Max Validators", "MaxValidators", 5, {
        //         value: ethers.utils.parseEther("1"),
        //     })
        //     const propose = await bscValidatorSet.checkProposal();
        //    // console.log("Check Proposal Id", propose[0]);
        //     expect(propose.length).to.equal(1);

        //     await bscValidatorSet.connect(addr5).unstakeValidator();
        //     const valInfo2 = await bscValidatorSet.getValidatorInfo(addr5.address);
        //     expect(valInfo2[1]).to.equal(3); 

        //     await bscValidatorSet.connect(addr5).voteProposal(propose[0], "true");
        // });

        // it("Validator Can Do Vote Even if he in Jailed status after creating proposal", async function () {
        //     await bscValidatorSet.connect(addr1).stakeValidator({
        //         value: ethers.utils.parseEther("20"),
        //     })
        //     await bscValidatorSet.connect(addr2).stakeValidator({
        //         value: ethers.utils.parseEther("15"),
        //     })
        //     await bscValidatorSet.connect(addr3).stakeValidator({
        //         value: ethers.utils.parseEther("25"),
        //     })
        //     await bscValidatorSet.connect(addr4).stakeValidator({
        //         value: ethers.utils.parseEther("30"),
        //     })
        //     await bscValidatorSet.connect(addr5).stakeValidator({
        //         value: ethers.utils.parseEther("35"),
        //     })
        //     await bscValidatorSet.connect(addr6).stakeValidator({
        //         value: ethers.utils.parseEther("12"),
        //     })
        //     const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
        //     expect(valInfo[1]).to.equal(2); 

        //     await bscValidatorSet.connect(addr3).createProposal("Changing Max Validators", "MaxValidators", 5, {
        //         value: ethers.utils.parseEther("1"),
        //     })
        //     const propose = await bscValidatorSet.checkProposal();
        //    // console.log("Check Proposal Id", propose[0]);
        //     expect(propose.length).to.equal(1);

        //     await bscValidatorSet.connect(addr1).slash(addr5.address);
        //     await bscValidatorSet.connect(addr1).slash(addr5.address);
        //     await bscValidatorSet.connect(addr1).slash(addr5.address);
        //     await bscValidatorSet.connect(addr1).slash(addr5.address);

        //     const valInfo1 = await bscValidatorSet.getValidatorInfo(addr5.address);
        //     expect(valInfo1[1]).to.equal(4);

        //     await bscValidatorSet.connect(addr5).voteProposal(propose[0], "true");
        // });

        // it("MaxValidator Size Should Change", async function () {
        //     await bscValidatorSet.connect(addr1).stakeValidator({
        //         value: ethers.utils.parseEther("20"),
        //     })
        //     await bscValidatorSet.connect(addr2).stakeValidator({
        //         value: ethers.utils.parseEther("15"),
        //     })
        //     await bscValidatorSet.connect(addr3).stakeValidator({
        //         value: ethers.utils.parseEther("25"),
        //     })
        //     await bscValidatorSet.connect(addr4).stakeValidator({
        //         value: ethers.utils.parseEther("30"),
        //     })
        //     await bscValidatorSet.connect(addr5).stakeValidator({
        //         value: ethers.utils.parseEther("35"),
        //     })
        //     await bscValidatorSet.connect(addr6).stakeValidator({
        //         value: ethers.utils.parseEther("12"),
        //     })
        //     const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
        //     expect(valInfo[1]).to.equal(2); 

        //     await bscValidatorSet.connect(addr3).createProposal("Changing Max Validators", "MaxValidators", 5, {
        //         value: ethers.utils.parseEther("1"),
        //     })
        //     const propose = await bscValidatorSet.checkProposal();
        //    // console.log("Check Proposal Id", propose[0]);
        //     expect(propose.length).to.equal(1);

        //     await bscValidatorSet.connect(addr5).voteProposal(propose[0], "true");
        //     await bscValidatorSet.connect(addr4).voteProposal(propose[0], "true");

        //     const highVal = await bscValidatorSet.getHighestValidators();
        //     expect(highVal.length).to.equal(5);
        //     expect(await bscValidatorSet.MaxValidators()).to.equal(5);
        // });

        // it("MaxValidator Size Should Not Change", async function () {
        //     await bscValidatorSet.connect(addr1).stakeValidator({
        //         value: ethers.utils.parseEther("20"),
        //     })
        //     await bscValidatorSet.connect(addr2).stakeValidator({
        //         value: ethers.utils.parseEther("15"),
        //     })
        //     await bscValidatorSet.connect(addr3).stakeValidator({
        //         value: ethers.utils.parseEther("25"),
        //     })
        //     await bscValidatorSet.connect(addr4).stakeValidator({
        //         value: ethers.utils.parseEther("30"),
        //     })
        //     await bscValidatorSet.connect(addr5).stakeValidator({
        //         value: ethers.utils.parseEther("35"),
        //     })
        //     await bscValidatorSet.connect(addr6).stakeValidator({
        //         value: ethers.utils.parseEther("12"),
        //     })
        //     const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
        //     expect(valInfo[1]).to.equal(2); 

        //     await bscValidatorSet.connect(addr3).createProposal("Changing Max Validators", "MaxValidators", 5, {
        //         value: ethers.utils.parseEther("1"),
        //     })
        //     const propose = await bscValidatorSet.checkProposal();
        //    // console.log("Check Proposal Id", propose[0]);
        //     expect(propose.length).to.equal(1);

        //     await bscValidatorSet.connect(addr5).voteProposal(propose[0], "false");
        //     await bscValidatorSet.connect(addr4).voteProposal(propose[0], "false");

        //     const highVal = await bscValidatorSet.getHighestValidators();
        //     expect(highVal.length).to.equal(4);
        //     expect(await bscValidatorSet.MaxValidators()).to.equal(4);
        // });

        // it("Minimum Stake Amount Should Change", async function () {
        //     await bscValidatorSet.connect(addr1).stakeValidator({
        //         value: ethers.utils.parseEther("20"),
        //     })
        //     await bscValidatorSet.connect(addr2).stakeValidator({
        //         value: ethers.utils.parseEther("15"),
        //     })
        //     await bscValidatorSet.connect(addr3).stakeValidator({
        //         value: ethers.utils.parseEther("25"),
        //     })
        //     await bscValidatorSet.connect(addr4).stakeValidator({
        //         value: ethers.utils.parseEther("30"),
        //     })
        //     await bscValidatorSet.connect(addr5).stakeValidator({
        //         value: ethers.utils.parseEther("35"),
        //     })
        //     await bscValidatorSet.connect(addr6).stakeValidator({
        //         value: ethers.utils.parseEther("12"),
        //     })
        //     const valInfo = await bscValidatorSet.getValidatorInfo(addr1.address);
        //     expect(valInfo[1]).to.equal(2); 

        //     await bscValidatorSet.connect(addr3).createProposal("Changing Min stake amount", "minimumStakeAmount", 20, {
        //         value: ethers.utils.parseEther("1"),
        //     })
        //     const propose = await bscValidatorSet.checkProposal();
        //    // console.log("Check Proposal Id", propose[0]);
        //     expect(propose.length).to.equal(1);

        //     await bscValidatorSet.connect(addr5).voteProposal(propose[0], "true");
        //     await bscValidatorSet.connect(addr4).voteProposal(propose[0], "true");

        //     expect(await bscValidatorSet.minimumStakeAmount()).to.equal("20000000000000000000");
        // });

    });

    /**********************Events***********************/
});
