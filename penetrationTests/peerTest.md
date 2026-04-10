# Penetration Tests
Cecily Black and Micaela Madariaga

## Self Attack
### Cecily
#### Attack 1
| Item           | Result                                            |
| -------------- | ------------------------------------------------- |
| Date           | April 7, 2026                                     |
| Target         | https://pizza.jwt-pizza.click                     |
| Classification | Identification and Authentication Failures        |
| Severity       | 2                                                 |
| Description    | I was able to do a brute force attack with several passwords and find one that worked.                                                              |
| Images         | ![image](./images/Self_BurpSuitePasswordTest.png) |
| Corrections    | Get users to have better passwords.               |

#### Attack 2
| Item           | Result                                                           |
| -------------- | ---------------------------------------------------------------- |
| Date           | April 9th, 2026                                                  |
| Target         | https://pizza.jwt-pizza.click                                    |
| Classification | Broken Access Control                                            |
| Severity       | 0                                                                |
| Description    | I tried to see franchises without being signed in as franchisee. |
| Images         | ![img](./images/Self_BrokenAccessControl.png)                    |
| Corrections    | Attack did not work.                                             |

#### Attack 3
| Item           | Result                                                      |
| -------------- | ----------------------------------------------------------- |
| Date           | April 9th, 2026                                             |
| Target         | https://pizza.jwt-pizza.click                               |
| Classification | Insecure Design                                             |
| Severity       | 2                                                           |
| Description    | Was able to order 5 pizzas for free after altering request. |
| Images         | ![img](./images/Self_InsecureDesign_Price0.png)             |
| Corrections    | Have extra checks to ensure prices.                         |

#### Attack 4
| Item           | Result                                          |
| -------------- | ----------------------------------------------- |
| Date           | April 9th, 2026                                 |
| Target         | https://pizza.jwt-pizza.click                   |
| Classification | Cryptographic Failures                          |
| Severity       | 0                                               |
| Description    | I tried modifying the JWT token. Did not accept the modified token. Though token could potentially contain information a person could exploit.                                |
| Images         | ![img](./images/Self_CryptographicFailures.png) |
| Corrections    | Attack did not succeed.                         |

#### Attack 5
| Item           | Result                                                |
| -------------- | ----------------------------------------------------- |
| Date           | April 9th, 2026                                       |
| Target         | https://pizza.jwt-pizza.click                         |
| Classification | SSRF (Server-Side Request Forgery)                    |
| Severity       | 1                                                     |
| Description    | I was able to interrupt calls to images from website. |
| Images         | ![img](./images/Self_SSRF.png)                        |
| Corrections    | Hide calls better, keep images internal.              |

### Micaela
#### Attack 1
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 2
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 3
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 4
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 5
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

## Peer Attack
### Cecily attack on Micaela: Create an attack record for each attack.
#### Attack 1
| Item           | Result                                            |
| -------------- | ------------------------------------------------- |
| Date           | April 10th, 2026                                  |
| Target         | https://pizza.micapizza.click                     |
| Classification | Identification and Authentication Failures        |
| Severity       | 0                                                 |
| Description    | I attempted to find admin's password, but failed. |
| Images         | ![img](./images/Peer_Password.png)                |
| Corrections    | Attack not successful.                            |

#### Attack 2
| Item           | Result                              |
| -------------- | ----------------------------------- |
| Date           | April 10th, 2026                    |
| Target         | https://pizza.micapizza.click       |
| Classification | Insecure Design                     |
| Severity       | 2                                   |
| Description    | I was able to get 10 free pizzas.   |
| Images         | ![img](./images/Peer_FreePizza.png) |
| Corrections    | Have extra checks to ensure prices. |

#### Attack 3
| Item           | Result                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| Date           | April 10th, 2026                                                                        |
| Target         | https://pizza.micapizza.click                                                           |
| Classification | SSRF (Server-Side Request Forgery)                                                      |
| Severity       | 1                                                                                       |
| Description    | I was able to replace images with different ones.                                       |
| Images         | ![img](./images/Peer_InterruptedImages.png) <br> ![img](./images/Peer_SwappedImage.png) |
| Corrections    | Hide calls better, keep images internal.                                                |

#### Attack 4
| Item           | Result                                          |
| -------------- | ----------------------------------------------- |
| Date           | April 10th, 2026                                |
| Target         | https://pizza.micapizza.click                   |
| Classification | Broken Access Control                           |
| Severity       | 1                                               |
| Description    | I was able to see diner dashboard without auth. |
| Images         | ![img](./images/Peer_BrokenAccess.png)          |
| Corrections    | Have more rigorous auth checks.                 |

#### Attack 5
| Item           | Result                                                    |
| -------------- | --------------------------------------------------------- |
| Date           | April 10th, 2026                                          |
| Target         | https://pizza.micapizza.click                             |
| Classification | Cryptographic Failures                                    |
| Severity       | 0                                                         |
| Description    | I tried modifying the auth token to look like franchisee. |
| Images         | ![img](./images/Peer_Crypto.png)                          |
| Corrections    | Attack did not succeed.                                   |

### Micaela attack on Cecily: Create an attack record for each attack.
#### Attack 1
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 2
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 3
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 4
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

#### Attack 5
| Item           | Result |
| -------------- | ------ |
| Date           |        |
| Target         |        |
| Classification |        |
| Severity       |        |
| Description    |        |
| Images         |        |
| Corrections    |        |

## Combined summary of learnings

I learned a lot from all of this! It was really cool to find out about Burp Suite and how it works. Playing around to see what I could break or get into was quite enjoyable. This deliverable has definitely made me more aware of how things could be vulnerable for attack. Even when I was not fully skilled enough to make an attack work, it definitely showed me how much effort and concious thought need to go into ensuring that a website is secure and safe. Some of the types of attacks I learned about were entirely new for me as well, which was quite interesting to learn more about and try. Overall, this was a pretty cool deliverable that was eye-opening.