import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  Claimed,
} from "../generated/Contract/Contract"
import { UserClaimedRewards } from "../generated/schema"

export function handleClaimed(event: Claimed): void {
  let userEthereumAddress = event.params.account.toHexString();
  log.debug('Loading user for address:', [userEthereumAddress])
  let userClaimedRewards = UserClaimedRewards.load(userEthereumAddress);
  if (userClaimedRewards === null) {
    log.debug('Creating new user for address:', [userEthereumAddress])
    userClaimedRewards = new UserClaimedRewards(userEthereumAddress)
    userClaimedRewards.totalRewardsClaimed = BigInt.fromI32(0)
  }

  userClaimedRewards.totalRewardsClaimed = userClaimedRewards.totalRewardsClaimed.plus(event.params.cumulativeAmount);
  log.debug('Total rewards claimed:', [userClaimedRewards.totalRewardsClaimed.toString()])

  userClaimedRewards.save()
}
