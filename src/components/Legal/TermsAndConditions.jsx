/*
  Author: Braden
  Description:
    Site terms & conditions
  Related PBIs: 1
*/

import React from 'react'
import styles from './index.module.css';

function TermsAndConditions(props) {
  return (
    <div className={`${props.padding ? styles.agreementPage : ""}`}>
      <h2 className="heading">Terms & Conditions</h2>
      <p>These terms and conditions (the "Terms and Conditions") govern the use of www.captstone-cryptalk.com (the "site"). This site is owned and operated by RMIT University.</p>
      <p>By using this site, you indicate that you have read and understand these Terms and Conditions and agree to abide by them at all times.</p>
      <p>THESE TERMS AND CONDITIONS CONTAIN A DISPUTE RESOLUTION CLAUSE THAT IMPACTS YOUR RIGHTS ABOUT HOW TO RESOLVE DISPUTES. PLEASE READ IT CAREFULLY.</p>
      <hr/>

      <h3 className="subheading">Intellectual Property</h3>
      <p>All content published and made available on our site is the property of Cryptalk and the site's creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our site.</p>
      <hr/>

      <h3 className="subheading">Age Restrictions</h3>
      <p>The minimum age to use our site is 16 years old. By using this site, users agree that they are over 16 years old. We do not assume any legal responsibility for false statements about age.</p>
      <hr/>

      <h3 className="subheading">Acceptable Use</h3>
      <p>As a user of our site, you agree to use our site legally, not to use our site for illegal purposes, and not to:</p>
      <ul>
        <li>-	Harass or mistreat other users of our site;</li>
        <li>-	Violate the rights of other users of our site;</li>
        <li>-	Violate the intellectual property rights of the site owners or any third party to the site;</li>
        <li>-	Hack into the account of another user of the site;</li>
        <li>-	Act in any way that could be considered fraudulent; or</li>
        <li>-	Post any material that may be deemed inappropriate or offensive.</li>
      </ul>
      <br/>
      <p>If we believe you are using our site illegally or in a manner that violates these Terms and Conditions, we reserve the right to limit, suspend or terminate your access to our site. We also reserve the right to take any legal steps necessary to prevent you from accessing our site.</p>
      <hr/>

      <h3 className="subheading">User Contributions</h3>
      <p>Users may post the following information on our site:</p>
      <li>	Photos; and</li>
      <li>	Videos.</li>
      <p>By posting publicly on our site, you agree that the content you post is open to download by other users and will be stored on our servers.</p>
      <hr/>

      <h3 className="subheading">Accounts</h3>
      <p>When you create an account on our site, you agree to the following:</p>
        <li>	You are solely responsible for your account and the security and privacy of your account, including passwords or sensitive information attached to that account; and</li>
        <li>	All personal information you provide to us through your account is up to date, accurate, and truthful and that you will update your personal information if it changes.</li>
      <p>We reserve the right to suspend or terminate your account if you are using our site illegally or if you violate these Terms and Conditions.</p>
      <hr/>

      <h3 className="subheading">User Goods and Services</h3>
      <p>Our site allows users to sell goods and services. We do not assume any responsibility for the goods and services users sell on our site. We cannot guarantee the quality or accuracy of any goods and services sold by users on our site. However, if we are made aware that a user is violating these Terms and Conditions, we reserve the right to suspend or prohibit the user from selling goods and services on our site.</p>
      <hr/>

      <h3 className="subheading">Limitation of Liability </h3>
      <p> Cryptalk and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities and expenses including legal fees from your use of the site.</p>
      <hr/>

      <h3 className="subheading">Indemnity</h3>
      <p>Except where prohibited by law, by using this site you indemnify and hold harmless Cryptalk and our directors, officers, agents, employees, subsidiaries, and affiliates from any actions, claims, losses, damages, liabilities and expenses including legal fees arising out of your use of our site or your violation of these Terms and Conditions.</p>
      <hr/>

      <h3 className="subheading">Applicable Law</h3>
      <p>These Terms and Conditions are governed by the laws of the State of Victoria.</p>
      <hr/>

      <h3 className="subheading">Dispute Resolution</h3>
      <p>Subject to any exceptions specified in these Terms and Conditions, if you and Cryptalk are unable to resolve any dispute through informal discussion, then you and Cryptalk agree to submit the issue before a mediator. The decision of the mediator will not be binding. Any mediator must be a neutral party acceptable to both you and Cryptalk. The costs of any mediation will be shared equally between you and Cryptalk.
      Not withstanding any other provision in these Terms and Conditions, you and Cryptalk agree that you both retain the right to bring an action in small claims court and to bring an action for injunctive relief or intellectual property infringement.</p>

      <h3 className="subheading">Severability</h3>
      <p>If at any time any of the provisions set forth in these Terms and Conditions are found to be inconsistent or invalid under applicable laws, those provisions will be deemed void and will be removed from these Terms and Conditions. All other provisions will not be affected by the removal and the rest of these Terms and Conditions will still be considered valid.</p>
      <hr/>

      <h3 className="subheading">Changes</h3>
      <p>These Terms and Conditions may be amended from time to time in order to maintain compliance with the law and to reflect any changes to the way we operate our site and the way we expect users to behave on our site. We will notify users by email of changes to these Terms and Conditions or post a notice on our site.</p>
      <hr/>

      <h3 className="subheading">Contact Details</h3>
      <p>Please contact us if you have any questions or concerns. Our contact details are as follows:</p>
      <h5 className="subcomment">EMAIL: s3787174@student.rmit.edu.au</h5>
      <h5 className="subcomment">ADDRESS: 124 La Trobe St</h5>
      <h5 className="subcomment">Effective Date: 23rd day of August, 2021</h5>
      <h5 className="subcomment">© 2002-2021 LawDepot.com ®</h5>
    </div>
  )
}

export default TermsAndConditions
