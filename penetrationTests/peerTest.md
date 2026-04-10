# Penetration Tests
Cecily Black and Micaela Madariaga

## Self Attack
### Cecily
#### Attack 1
| Item           | Result                                           |
| -------------- | ------------------------------------------------ |
| Date           | April 7, 2026                                    |
| Target         | https://pizza.jwt-pizza.click                    |
| Classification | Identification and Authentication Failures       |
| Severity       | 2                                                |
| Description    | I was able to do a brute force attack with several passwords and find one that worked.                                                             |
| Images         | ![image](./images/Self_BurpSuitePasswordTest.png) |
| Corrections    | Get users to have better passwords               |

#### Attack 2
| Item           | Result                                                           |
| -------------- | ---------------------------------------------------------------- |
| Date           | April 9th, 2026                                                  |
| Target         | https://pizza.jwt-pizza.click                                    |
| Classification | Broken Access Control                                            |
| Severity       | 0                                                                |
| Description    | I tried to see franchises without being signed in as franchisee. |
| Images         | ![img](./images/Self_BrokenAccessControl.png)                     |
| Corrections    | Attack did not work                                              |

#### Attack 3
| Item           | Result                                                      |
| -------------- | ----------------------------------------------------------- |
| Date           | April 9th, 2026                                             |
| Target         | https://pizza.jwt-pizza.click                               |
| Classification | Insecure Design                                             |
| Severity       | 2                                                           |
| Description    | Was able to order 5 pizzas for free after altering request. |
| Images         | ![img](./images/Self_InsecureDesign_Price0.png)              |
| Corrections    | Have extra checks to ensure prices                          |

#### Attack 4
| Item           | Result                                         |
| -------------- | ---------------------------------------------- |
| Date           | April 9th, 2026                                |
| Target         | https://pizza.jwt-pizza.click                  |
| Classification | Cryptographic Failures                         |
| Severity       | 0                                              |
| Description    | I tried modifying the JWT token. Did not accept the modified token. Though token could potentially contain information a person could exploit.                               |
| Images         | ![img](./images/Self_CryptographicFailures.png) |
| Corrections    | Attack did not succeed.                        |

#### Attack 5
| Item           | Result                                                |
| -------------- | ----------------------------------------------------- |
| Date           | April 9th, 2026                                       |
| Target         | https://pizza.jwt-pizza.click                         |
| Classification | SSRF (Server-Side Request Forgery)                    |
| Severity       | 1                                                     |
| Description    | I was able to interrupt calls to images from website. |
| Images         | ![img](./images/Self_SSRF.png)                         |
| Corrections    | Hide calls better, keep images internal               |

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
| Item           | Result                        |
| -------------- | ----------------------------- |
| Date           |                               |
| Target         | https://pizza.micapizza.click |
| Classification |                               |
| Severity       |                               |
| Description    |                               |
| Images         |                               |
| Corrections    |                               |

#### Attack 2
| Item           | Result                        |
| -------------- | ----------------------------- |
| Date           |                               |
| Target         | https://pizza.micapizza.click |
| Classification |                               |
| Severity       |                               |
| Description    |                               |
| Images         |                               |
| Corrections    |                               |

#### Attack 3
| Item           | Result                        |
| -------------- | ----------------------------- |
| Date           |                               |
| Target         | https://pizza.micapizza.click |
| Classification |                               |
| Severity       |                               |
| Description    |                               |
| Images         |                               |
| Corrections    |                               |

#### Attack 4
| Item           | Result                        |
| -------------- | ----------------------------- |
| Date           |                               |
| Target         | https://pizza.micapizza.click |
| Classification |                               |
| Severity       |                               |
| Description    |                               |
| Images         |                               |
| Corrections    |                               |

#### Attack 5
| Item           | Result                        |
| -------------- | ----------------------------- |
| Date           |                               |
| Target         | https://pizza.micapizza.click |
| Classification |                               |
| Severity       |                               |
| Description    |                               |
| Images         |                               |
| Corrections    |                               |

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