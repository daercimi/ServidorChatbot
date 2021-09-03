"""
Create new lead in Odoo CRM
"""

import json
import xmlrpclib

# utils
def log(_from, method, val):
    print('[{}]{}:\t{}.'.format(_from, method, val))

class OdooAgent():

    def __init__(self):

        # Configuration
        self.url = 'https://regorhomeblog.odoo.com'
        self.db = 'regorhomeblog'
        self.username = 'yihsic@gmail.com'
        self.password = 'b52e6e53821f91595c387d44825cf7be990fd6a4' # API KEY

    def auth(self):

        common = xmlrpclib.ServerProxy('{}/xmlrpc/2/common'.format(self.url))
        log('Odoo', 'proxy_version', common.version())
        
        self.uid = common.authenticate(self.db, self.username, self.password, {})
        log('Odoo', 'Auth', 'SUCCESS' if self.uid else 'FAIL')
        
        self.models = xmlrpclib.ServerProxy('{}/xmlrpc/2/object'.format(self.url))

    def createLead(self, data):

        id = self.models.execute_kw(
            self.db, self.uid, self.password, 
            'crm.lead',
            'create',
            [data]
        )
        log('Odoo', 'createLead', id if id else 'FAIL')

def CLIparserargs():

    """ Usage
python nlocrm.py --lastname  'Ramos Paredes' --givenname Roger Anthony --email rogrp@regc.com --company r3gor --phone 123456789 --service marketing --date 2021-09-07T12:00:00-05:00 --time 2021-09-03T10:00:00-05:00
    """

    import argparse
    parser = argparse.ArgumentParser()
    parser.description = 'Crea un nuevo lead en Odoo CRM'

    parser.add_argument('--lastname')
    parser.add_argument('--givenname')
    parser.add_argument('--email')
    parser.add_argument('--company')
    parser.add_argument('--phone')
    parser.add_argument('--service')
    parser.add_argument('--date')
    parser.add_argument('--time')

    return parser.parse_args()

if __name__ == '__main__':
    
    args = CLIparserargs()

    # print(args)
    # exit(0)

    oa = OdooAgent()

    oa.auth()
    
    oa.createLead({
        "name": '{}: {}'.format(args.company, args.service) ,
        "phone": args.phone,
        "priority": "2",
        "email_from": args.email,
        "expected_revenue": 300,
        "partner_name": '{}: {} {}'.format(args.company, args.lastname, args.givenname),
    })