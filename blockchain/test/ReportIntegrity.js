const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReportIntegrity Smart Contract", function () {
  let reportIntegrity;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const ReportIntegrityFactory = await ethers.getContractFactory("ReportIntegrity");
    reportIntegrity = await ReportIntegrityFactory.deploy();
  });

  it("Should register and verify a report hash successfully", async function () {
    const reportHash = ethers.keccak256(ethers.toUtf8Bytes("Sample report data"));

    // Register hash
    await expect(reportIntegrity.connect(owner).registerReport(reportHash))
      .to.emit(reportIntegrity, "ReportRegistered")
      .withArgs(reportHash, owner.address, anyValue => true);

    // Verify hash details
    const [exists, timestamp, issuer] = await reportIntegrity.verifyReport(reportHash);
    expect(exists).to.be.true;
    expect(issuer).to.equal(owner.address);
    expect(Number(timestamp)).to.be.greaterThan(0);
  });

  it("Should fail when registering an already registered report hash", async function () {
    const reportHash = ethers.keccak256(ethers.toUtf8Bytes("Sample report data"));

    // Register first time
    await reportIntegrity.connect(owner).registerReport(reportHash);

    // Attempt second time should revert
    await expect(reportIntegrity.connect(addr1).registerReport(reportHash))
      .to.be.revertedWith("Report already registered");
  });

  it("Should return false for non-registered report hashes", async function () {
    const fakeHash = ethers.zeroPadValue("0x1234", 32);
    const [exists, timestamp, issuer] = await reportIntegrity.verifyReport(fakeHash);
    expect(exists).to.be.false;
    expect(Number(timestamp)).to.equal(0);
    expect(issuer).to.equal(ethers.ZeroAddress);
  });
});
