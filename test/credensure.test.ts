import { expect,assert } from 'chai';
import { Contract, Wallet } from "zksync-ethers";
import { getWallet, deployContract, LOCAL_RICH_WALLETS } from '../deploy/utils';
import * as ethers from "ethers";


describe("CredenSure", function () {
    let credenSure : Contract;
    let owner : Wallet;
    let addr1 : Wallet;
    let addr2 : Wallet;

    beforeEach(async function () {
        owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
        addr1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey);
    
        credenSure = await deployContract("CredenSure", [], { wallet: owner, silent: true });
    });

    describe("Issue Credential", function () {
        it("should issue a credential to a recipient", async function () {
            await credenSure.issueCredential(addr1.address, "Credential Data 1");
            const credentials = await credenSure.getCredentials(addr1.address);
            expect(credentials.length).to.equal(1);
            expect(credentials[0].issuer).to.equal(owner.address);
            expect(credentials[0].data).to.equal("Credential Data 1");
        });
    });

    describe("Endorse", function () {
        it("should endorse a recipient", async function () {
            await credenSure.endorse(addr1.address, "Endorsement Message 1");
            const endorsements = await credenSure.getEndorsements(addr1.address);
            expect(endorsements.length).to.equal(1);
            expect(endorsements[0].endorser).to.equal(owner.address);
            expect(endorsements[0].message).to.equal("Endorsement Message 1");
        });
    });

    describe("Multiple Credentials and Endorsements", function () {
        it("should handle multiple credentials and endorsements", async function () {
            // Issue multiple credentials
            await credenSure.issueCredential(addr1.address, "Credential Data 1");
            await credenSure.issueCredential(addr1.address, "Credential Data 2");
            await credenSure.issueCredential(addr2.address, "Credential Data 3");

            // Endorse multiple times
            await credenSure.endorse(addr1.address, "Endorsement Message 1");
            await credenSure.endorse(addr2.address, "Endorsement Message 2");
            await credenSure.endorse(addr2.address, "Endorsement Message 3");

            // Check credentials
            const credentialsAddr1 = await credenSure.getCredentials(addr1.address);
            const credentialsAddr2 = await credenSure.getCredentials(addr2.address);

            expect(credentialsAddr1.length).to.equal(2);
            expect(credentialsAddr1[0].data).to.equal("Credential Data 1");
            expect(credentialsAddr1[1].data).to.equal("Credential Data 2");

            expect(credentialsAddr2.length).to.equal(1);
            expect(credentialsAddr2[0].data).to.equal("Credential Data 3");

            // Check endorsements
            const endorsementsAddr1 = await credenSure.getEndorsements(addr1.address);
            const endorsementsAddr2 = await credenSure.getEndorsements(addr2.address);

            expect(endorsementsAddr1.length).to.equal(1);
            expect(endorsementsAddr1[0].message).to.equal("Endorsement Message 1");

            expect(endorsementsAddr2.length).to.equal(2);
            expect(endorsementsAddr2[0].message).to.equal("Endorsement Message 2");
            expect(endorsementsAddr2[1].message).to.equal("Endorsement Message 3");
        });
    });
});
