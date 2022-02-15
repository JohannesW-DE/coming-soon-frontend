import { hasOperationName, aliasQuery, aliasMutation } from './utils/graphql-test-utils'
import { format, addDays, getUnixTime, subDays, startOfISOWeek, startOfMonth, endOfISOWeek, endOfMonth, addMonths, set } from 'date-fns'


describe('Coming Soon (user is logged in)', () => {
  let comingSoon = {}
  let comingSoonPrefetch = {}
  let comingSoonNext = {}
  let comingSoonMonth = {}
  let currentUser = {}
  let emptyList = {}
  let listWithWitcherSeason1 = {};
  let listWithWitcherSeason2 = {};
  let suggestionsWitcher = {};
  let episodes = {};
  let multiSearchMoonfall = {};
  let suggestionsMoonfallPre = {};
  let suggestionsMoonfallPost = {};

  beforeEach(function () {
    cy.readFile('cypress/fixtures/ComingSoon.json').then((str) => {
      comingSoon = str;
      
      comingSoon.matches[0].episode.air_date = getUnixTime(subDays(new Date(), 1)) * 1000;
      comingSoon.matches[1].episode.air_date = getUnixTime(new Date()) * 1000;
      comingSoon.matches[2].episode.air_date = getUnixTime(addDays(new Date(), 3)) * 1000;
    })

    cy.readFile('cypress/fixtures/ComingSoonPrefetch.json').then((str) => {
      comingSoonPrefetch = str;
      
      comingSoonPrefetch.matches[0].episode.air_date =  getUnixTime(subDays(new Date(), 7)) * 1000;
      comingSoonPrefetch.matches[1].episode.air_date =  getUnixTime(subDays(new Date(), 7)) * 1000;
      comingSoonPrefetch.matches[2].episode.air_date =  getUnixTime(addDays(new Date(), 6)) * 1000;
      comingSoonPrefetch.matches[3].episode.air_date =  getUnixTime(subDays(new Date(), 5)) * 1000;
      comingSoonPrefetch.matches[4].episode.air_date =  getUnixTime(subDays(new Date(), 4)) * 1000;
      comingSoonPrefetch.matches[5].episode.air_date =  getUnixTime(subDays(new Date(), 4)) * 1000;
      comingSoonPrefetch.matches[6].episode.air_date =  getUnixTime(subDays(new Date(), 4)) * 1000;
      comingSoonPrefetch.matches[7].episode.air_date =  getUnixTime(subDays(new Date(), 4)) * 1000;
      comingSoonPrefetch.matches[8].episode.air_date =  getUnixTime(subDays(new Date(), 4)) * 1000;
      comingSoonPrefetch.matches[9].episode.air_date =  getUnixTime(subDays(new Date(), 4)) * 1000;
      comingSoonPrefetch.matches[10].episode.air_date = getUnixTime(subDays(new Date(), 4)) * 1000;   
      comingSoonPrefetch.matches[11].episode.air_date = getUnixTime(subDays(new Date(), 2)) * 1000;                                          
      comingSoonPrefetch.matches[12].episode.air_date = getUnixTime(new Date()) * 1000;
      comingSoonPrefetch.matches[14].episode.air_date = getUnixTime(addDays(new Date(), 1)) * 1000;
      comingSoonPrefetch.matches[14].episode.air_date = getUnixTime(addDays(new Date(), 2)) * 1000;
      comingSoonPrefetch.matches[15].episode.air_date = getUnixTime(addDays(new Date(), 7)) * 1000;
      comingSoonPrefetch.matches[16].episode.air_date = getUnixTime(addDays(new Date(), 7)) * 1000;
      comingSoonPrefetch.matches[17].episode.air_date = getUnixTime(addDays(new Date(), 8)) * 1000;
      comingSoonPrefetch.matches[18].episode.air_date = getUnixTime(addDays(new Date(), 9)) * 1000;
      comingSoonPrefetch.matches[19].episode.air_date = getUnixTime(addDays(new Date(), 14)) * 1000;                               
    })    

    cy.readFile('cypress/fixtures/comingSoonMonth.json').then((str) => {
      comingSoonMonth = str;

      comingSoonMonth.matches[0].episode.air_date = getUnixTime(set(new Date(), {date: 1})) * 1000;
      comingSoonMonth.matches[1].episode.air_date = getUnixTime(set(new Date(), {date: 4})) * 1000;
      comingSoonMonth.matches[2].episode.air_date = getUnixTime(set(new Date(), {date: 5})) * 1000;
      comingSoonMonth.matches[3].episode.air_date = getUnixTime(set(new Date(), {date: 9})) * 1000;
      comingSoonMonth.matches[4].episode.air_date = getUnixTime(set(new Date(), {date: 11})) * 1000;
      comingSoonMonth.matches[5].episode.air_date = getUnixTime(set(new Date(), {date: 11})) * 1000;
      comingSoonMonth.matches[6].episode.air_date = getUnixTime(set(new Date(), {date: 12})) * 1000;
      comingSoonMonth.matches[7].episode.air_date = getUnixTime(set(new Date(), {date: 13})) * 1000;
      comingSoonMonth.matches[8].episode.air_date = getUnixTime(set(new Date(), {date: 13})) * 1000;
      comingSoonMonth.matches[9].episode.air_date = getUnixTime(set(new Date(), {date: 13})) * 1000;

      comingSoonMonth.matches[10].episode.air_date = getUnixTime(set(new Date(), {date: 16})) * 1000; 
      comingSoonMonth.matches[11].episode.air_date = getUnixTime(set(new Date(), {date: 18})) * 1000; 
      comingSoonMonth.matches[12].episode.air_date = getUnixTime(set(new Date(), {date: 18})) * 1000; 
      comingSoonMonth.matches[13].episode.air_date = getUnixTime(set(new Date(), {date: 19})) * 1000; 
      comingSoonMonth.matches[14].episode.air_date = getUnixTime(set(new Date(), {date: 20})) * 1000; 
      comingSoonMonth.matches[15].episode.air_date = getUnixTime(set(new Date(), {date: 21})) * 1000; 
      comingSoonMonth.matches[16].episode.air_date = getUnixTime(set(new Date(), {date: 21})) * 1000; 
      comingSoonMonth.matches[17].episode.air_date = getUnixTime(set(new Date(), {date: 21})) * 1000;
      comingSoonMonth.matches[18].episode.air_date = getUnixTime(set(new Date(), {date: 21})) * 1000; 
      comingSoonMonth.matches[19].episode.air_date = getUnixTime(set(new Date(), {date: 21})) * 1000;
      
      comingSoonMonth.matches[20].episode.air_date = getUnixTime(set(new Date(), {date: 21})) * 1000; 
      comingSoonMonth.matches[21].episode.air_date = getUnixTime(set(new Date(), {date: 21})) * 1000;
      comingSoonMonth.matches[22].episode.air_date = getUnixTime(set(new Date(), {date: 23})) * 1000; 
      comingSoonMonth.matches[23].episode.air_date = getUnixTime(set(new Date(), {date: 25})) * 1000;   
      comingSoonMonth.matches[24].episode.air_date = getUnixTime(set(new Date(), {date: 26})) * 1000; 
      comingSoonMonth.matches[25].episode.air_date = getUnixTime(set(new Date(), {date: 27})) * 1000;          
    })

    cy.readFile('cypress/fixtures/comingSoonNext.json').then((str) => {
      const nextMonth = addMonths(new Date(), 1)

      comingSoonNext = str;

      comingSoonNext.matches[0].episode.air_date = getUnixTime(set(nextMonth, {date: 1})) * 1000;
      comingSoonNext.matches[1].episode.air_date = getUnixTime(set(nextMonth, {date: 1})) * 1000;
      comingSoonNext.matches[2].episode.air_date = getUnixTime(set(nextMonth, {date: 2})) * 1000;
      comingSoonNext.matches[3].episode.air_date = getUnixTime(set(nextMonth, {date: 3})) * 1000;
      comingSoonNext.matches[4].episode.air_date = getUnixTime(set(nextMonth, {date: 8})) * 1000;
      comingSoonNext.matches[5].episode.air_date = getUnixTime(set(nextMonth, {date: 9})) * 1000;
      comingSoonNext.matches[6].episode.air_date = getUnixTime(set(nextMonth, {date: 10})) * 1000;
      comingSoonNext.matches[7].episode.air_date = getUnixTime(set(nextMonth, {date: 15})) * 1000;
      comingSoonNext.matches[8].episode.air_date = getUnixTime(set(nextMonth, {date: 17})) * 1000;
      comingSoonNext.matches[9].episode.air_date = getUnixTime(set(nextMonth, {date: 22})) * 1000;

      comingSoonNext.matches[10].episode.air_date = getUnixTime(set(nextMonth, {date: 22})) * 1000; 
      comingSoonNext.matches[11].episode.air_date = getUnixTime(set(nextMonth, {date: 28})) * 1000; 
      comingSoonNext.matches[12].episode.air_date = getUnixTime(set(nextMonth, {date: 28})) * 1000; 
    })

    cy.readFile('cypress/fixtures/CurrentUser.json').then((str) => {
      currentUser = str;
    })

    cy.readFile('cypress/fixtures/lists/61a1f255e83ceab2de000000.json').then((str) => {
      emptyList = str;
    })

    cy.readFile('cypress/fixtures/lists/61a1f255e83ceab2de000000_season_2.json').then((str) => {
      listWithWitcherSeason2 = str;
    })

    cy.readFile('cypress/fixtures/lists/61a1f255e83ceab2de000000_season_1.json').then((str) => {
      listWithWitcherSeason1 = str;
    })

    cy.readFile('cypress/fixtures/suggestions/witcher.json').then((str) => {
      suggestionsWitcher = str;
    })

    cy.readFile('cypress/fixtures/episodes.json').then((str) => {
      episodes = str;
    })
    
    cy.readFile('cypress/fixtures/multisearch_moonfall.json').then((str) => {
      multiSearchMoonfall = str;
    })

    cy.readFile('cypress/fixtures/suggestions/moonfall_pre.json').then((str) => {
      suggestionsMoonfallPre = str;
    })

    cy.readFile('cypress/fixtures/suggestions/moonfall_post.json').then((str) => {
      suggestionsMoonfallPost = str;
    })

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      aliasQuery(req, 'List');
      aliasQuery(req, 'CurrentUser');      
      aliasQuery(req, 'ComingSoon');
      aliasQuery(req, 'Suggestions');
      aliasQuery(req, 'Episodes');
      aliasQuery(req, 'MultiSearch');

      aliasMutation(req, 'UpdateWatched');
      aliasMutation(req, 'CreateList');
      aliasMutation(req, 'DeleteList');
      aliasMutation(req, 'UpdateListDetails'); 
      aliasMutation(req, 'AddTvShowToList');
      aliasMutation(req, 'RemoveEntryFromList');
      aliasMutation(req, 'UpdateComment');
    })
  })

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

  it('should be able to modify timespan for coming soon', () => {
    let interceptCount = 0;
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (hasOperationName(req, 'ComingSoon')) {
        req.alias = 'gqlComingSoonQuery'

        let json = {};
        if (interceptCount === 0) {
          json = comingSoon;
        } else if (interceptCount === 1) {
          json = comingSoonMonth;
        } else if (interceptCount === 2) {
          json = comingSoonNext;
        }

        interceptCount += 1;

        req.reply({
          data: {
            comingSoon: json
          }
        });   
      }      
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
  
    }).as('gql');

    cy.visit('http://localhost:3000/coming-soon')

    cy.contains('Coming Soonish ™')
    cy.contains('yesterday')
    cy.contains('next 5 days')   
    
    cy.wait(1000)

    /*
    cy.get('input[id="from"]').trigger('mouseover');
    cy.wait('@gqlComingSoonQuery')
    */

    cy.get('div').filter((i, el) => el.hasAttribute('data-day-id')).should('have.length', 7)
    
    cy.get('input[id="from"]').then(($range) => {
      // get the DOM node
      const range = $range[0];
      // set the value manually
      nativeInputValueSetter.call(range, -3);
      // now dispatch the event
      range.dispatchEvent(new Event('change', { value: -3, bubbles: true }));
    });

    cy.wait(1000)

    cy.get('input[id="to"]').then(($range) => {
      // get the DOM node
      const range = $range[0];
      // set the value manually
      nativeInputValueSetter.call(range, 4);
      // now dispatch the event
      range.dispatchEvent(new Event('change', { value: 4, bubbles: true }));
    });

    cy.wait(1000)

    cy.get('div').filter((i, el) => el.hasAttribute('data-day-id')).should('have.length', 8);
  })

  it('should be able to add movie via imdb link', () => {
    let suggestionsInterceptCount = 0;

    cy.intercept('POST', 'http://localhost:4000/graphql', async (req) => {              
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
      if (hasOperationName(req, 'MultiSearch')) {
        req.alias = 'gqlMultiSearchQuery'
        
        req.reply({
          data: {
            multiSearch: multiSearchMoonfall
          }
        });
      }
      if (hasOperationName(req, 'List')) {
        req.alias = 'gqlListQuery'
        req.reply({
          data: {
            list: emptyList
          }
        });         
      }       
      if (hasOperationName(req, 'Suggestions')) {
        req.alias = 'gqlSuggestionsQuery'

        let json = suggestionsMoonfallPre;
        if (suggestionsInterceptCount === 3) { // one fake call everytime the listview loads :/
          json = suggestionsMoonfallPost;
        }
        suggestionsInterceptCount += 1;

        req.reply({
          data: {
            suggestions: json
          }
        });         
      }             
    }).as('gql');  

    cy.visit('http://localhost:3000/list/61a1f255e83ceab2de000000');
    cy.wait('@gql');
    cy.get('#search').type('Moonfall');  
    cy.wait(1000)    
    cy.wait('@gql');
    cy.contains('no match');
    cy.get('#search').clear().type('https://www.imdb.com/title/tt5834426/');  
    cy.wait(1000)    
    cy.wait('@gql') 
    cy.contains('click here to');     
    cy.get('#multisearch').click();    
    cy.wait(1000)    
    cy.wait('@gql')
    cy.contains('Search successful');
    cy.contains('Moonfall (2022)');
  });

  it('should be able expand and mouseover watch providers', () => {
    cy.intercept('POST', 'http://localhost:4000/graphql', async (req) => {              
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
      if (hasOperationName(req, 'List')) {
        req.alias = 'gqlListQuery'

        req.reply({
          data: {
            list: listWithWitcherSeason1
          }
        });         
      }              
    }).as('gql');

    cy.visit('http://localhost:3000/list/61a1f255e83ceab2de000000');
    cy.wait('@gql')

    cy.get('div[data-entry-id="61cc80c5ce51533e5484bc05-1"]').within(() => {
      cy.contains('Season 1');
      cy.get('div').filter((i, el) => el.hasAttribute('data-wp-id')).should('have.length', 6)      
      cy.get('#expand-wp').click();
      cy.get('div').filter((i, el) => el.hasAttribute('data-wp-id')).should('have.length', 8)
      cy.get('div[data-wp-id="61dff0e65a24b29210c66a7f-DE"]').trigger('mouseover')
    }) 
    cy.wait(1000)          
    cy.contains('Netflix (DE)');    
  });

  it('should be able to write comment', () => {
    let listInterceptCount = 0;

    cy.intercept('POST', 'http://localhost:4000/graphql', async (req) => {              
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
      if (hasOperationName(req, 'Episodes')) {
        req.alias = 'gqlEpisodesQuery'
        req.reply({
          data: {
            episodes
          }
        });
      }
      if (hasOperationName(req, 'UpdateComment')) {
        req.alias = 'gqlUpdateCommentQuery'
        req.reply({
          data: {
            updateComment: true
          }
        });
      }
      if (hasOperationName(req, 'List')) {
        req.alias = 'gqlListQuery'

        let json = listWithWitcherSeason1
        if (listInterceptCount === 1) {
          json.entries[0].comment = "Line #1\nLine #2";
        }
        listInterceptCount += 1;

        req.reply({
          data: {
            list: json
          }
        });         
      }              
    }).as('gql');

    cy.visit('http://localhost:3000/list/61a1f255e83ceab2de000000');
    cy.wait('@gql')

    cy.get('div[data-entry-id="61cc80c5ce51533e5484bc05-1"]').within(() => {
      cy.contains('Season 1');
      cy.get('#edit').click();
      cy.get('#comment').click().type('Line #1{enter}Line #2');
      cy.get('#save').click();
      cy.contains(/Line #1\sLine #2/)
    }) 
  });

  it('should be able to expand episode list', () => {
    cy.intercept('POST', 'http://localhost:4000/graphql', async (req) => {              
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
      if (hasOperationName(req, 'Episodes')) {
        req.alias = 'gqlEpisodesQuery'
        req.reply({
          data: {
            episodes
          }
        });
      }

      if (hasOperationName(req, 'List')) {
        req.alias = 'gqlListQuery'
        req.reply({
          data: {
            list: listWithWitcherSeason1
          }
        });        
      }              
    }).as('gql');

    cy.visit('http://localhost:3000/list/61a1f255e83ceab2de000000');
    cy.wait('@gql')

    cy.get('div[data-entry-id="61cc80c5ce51533e5484bc05-1"]').within(() => {
      cy.contains('Season 1')
      cy.get('#expand-ep-lower').should('not.exist');
      cy.get('#expand-ep-upper').should('exist').click(); 
      cy.wait('@gql')
      cy.get('div').filter((i, el) => el.hasAttribute('data-episode-id')).should('have.length', 8)
      cy.get('div[data-episode-id="1927355"]').within(() => { // #1
        cy.get('[type="checkbox"]').should("be.checked");
      });
      cy.get('div[data-episode-id="1954613"]').within(() => { // #3
        cy.get('[type="checkbox"]').should("be.not.checked");
      });
      cy.get('div[data-episode-id="1954618"]').within(() => { // #8
        cy.contains('Much More').click();
        cy.contains('A terrifying pack of foes lays Geralt low.');
      });      
      cy.get('#expand-ep-lower').should('exist').click();
      cy.get('div').filter((i, el) => el.hasAttribute('data-episode-id')).should('have.length', 1)           
    }) 
  });

  it('should be able to add tv show to list and remove it', () => {
    let listInterceptCount = 0;

    cy.intercept('POST', 'http://localhost:4000/graphql', async (req) => {
      if (hasOperationName(req, 'AddTvShowToList')) {
        req.alias = 'gqlAddTvShowToListMutation'
        req.reply({
          data: {
            addTvShowToList: true
          }
        });
      } 
      if (hasOperationName(req, 'RemoveEntryFromList')) {
        req.alias = 'gqlRemoveEntryFromListMutation'
        req.reply({
          data: {
            removeEntryFromList: true
          }
        });
      }                
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
      if (hasOperationName(req, 'Suggestions')) {
        req.alias = 'gqlSuggestionsQuery'
        req.reply({
          data: {
            suggestions: suggestionsWitcher
          }
        });        
      }    
      if (hasOperationName(req, 'List')) {
        req.alias = 'gqlListQuery'

        let json = {}
        if (listInterceptCount === 0) {
          json = emptyList;
        } else if (listInterceptCount === 1) {
          json = listWithWitcherSeason2;
        } else if (listInterceptCount === 2) {
          json = emptyList;
        } else if (listInterceptCount === 3) {
          json = listWithWitcherSeason1;
        } 

        listInterceptCount += 1;

        req.reply({
          data: {
            list: json
          }
        });        
      }              
    }).as('gql');

    cy.visit('http://localhost:3000/list/61a1f255e83ceab2de000000');
    cy.wait('@gql')
    cy.get('#search').type('witcher');
    cy.wait(1000)    
    cy.wait('@gql')
    cy.get(`div[data-suggestion-id="61cc80c5ce51533e5484bc02"]`).should('exist')    
    cy.get(`div[data-suggestion-id="61cc80c5ce51533e5484bc05"]`).should('exist').click();
    cy.wait(1000)    
    cy.wait('@gql')  
    cy.get('div[data-entry-id="61cc80c5ce51533e5484bc05-2"]').within(() => {
      cy.contains('Season 2')
      cy.get('#remove').click();     
    })      
    cy.wait(1000)    
    cy.wait('@gql')   
    cy.get('#search').click();
    cy.get(`div[data-suggestion-id="61cc80c5ce51533e5484bc05"]`).contains('Season 1').click(); 
    cy.wait(1000)    
    cy.wait('@gql') 
    cy.get('div[data-entry-id="61cc80c5ce51533e5484bc05-1"]').within(() => {
      cy.contains('Season 1')    
    })                
  });

  it('should be able to create new list', () => {
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (hasOperationName(req, 'ComingSoon')) {
        req.alias = 'gqlComingSoonQuery'
        req.reply({
          data: {
            comingSoon
          }
        });
      }      
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
      if (hasOperationName(req, 'CreateList')) {
        req.alias = 'gqlCreateListMutation'
        req.reply({
          data: {
            createList: '61a1f255e83ceab2de000000'
          }
        });        
      }    
      if (hasOperationName(req, 'List')) {
        req.alias = 'gqlListQuery'
        req.reply({
          data: {
            list: emptyList
          }
        });        
      }              
    }).as('gql');    

    cy.visit('http://localhost:3000/coming-soon');
    cy.wait('@gql')
    cy.get('#lists').click();
    cy.get('#createList').click();
    cy.get('#name').type('List #1');
    cy.get('#description').type('created for cypress.io testing');
    cy.get('#submit').click();
    cy.wait('@gqlListQuery')  
    cy.get('span').contains('List #1');
    cy.get('span').contains('created for cypress.io testing');
  });

  it('should be able to switch to calendar view and switch to next month', () => {
    let interceptCount = 0;

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (hasOperationName(req, 'ComingSoon')) {
        req.alias = 'gqlComingSoonQuery'

        let json = {};
        if (interceptCount === 0) {
          json = comingSoon;
        } else if (interceptCount === 1) {
          json = comingSoonMonth;
        } else if (interceptCount === 2) {
          json = comingSoonNext;
        }

        interceptCount += 1;

        req.reply({
          data: {
            comingSoon: json
          }
        });   
      }      
      if (hasOperationName(req, 'CurrentUser')) {
        req.alias = 'gqlCurrentUserQuery'
        req.reply({
          data: {
            currentUser
          }
        });
      }
      if (hasOperationName(req, 'UpdateWatched')) {
        req.alias = 'gqlUpdateWatchedMutation'
        req.reply({
          data: {
            updateWatched: true
          }
        });
      }      
    });

    cy.visit('http://localhost:3000/coming-soon')
    cy.wait('@gqlComingSoonQuery')
    
    cy.get('span').contains('Calendar').click()

    cy.log('checking if the current month & year are correct')
    cy.contains(format(new Date(), 'MMMM'))
    cy.contains(format(new Date(), 'yyyy'))

    cy.log('checking if the first and last day are correct')

    let from = format(startOfISOWeek(startOfMonth(new Date())), 'yyyyMMdd')
    let to = format(endOfISOWeek(endOfMonth(new Date())), 'yyyyMMdd')
    cy.get(`div[data-day-id="${from}"]`).should('exist')
    cy.get(`div[data-day-id="${to}"]`).should('exist')
    
    cy.get('div').filter((i, el) => el.hasAttribute('data-entry-id')).should('have.length', 26)

    cy.get('svg[id="next"]').click()

    cy.log('checking if the current month & year are correctly updated for next month')

    cy.contains(format(addMonths(new Date(), 1), 'MMMM'))
    cy.contains(format(addMonths(new Date(), 1), 'yyyy'))

    cy.log('checking if the first and last day are correct for next month')

    from = format(startOfISOWeek(startOfMonth(addMonths(new Date(), 1))), 'yyyyMMdd')
    to = format(endOfISOWeek(endOfMonth(addMonths(new Date(), 1))), 'yyyyMMdd')

    cy.get(`div[data-day-id="${from}"]`).should('exist')
    cy.get(`div[data-day-id="${to}"]`).should('exist')

    cy.get('div').filter((i, el) => el.hasAttribute('data-entry-id')).should('have.length', 13)
  })

})