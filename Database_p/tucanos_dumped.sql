--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Flight_Project; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "Flight_Project";


ALTER SCHEMA "Flight_Project" OWNER TO postgres;

--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- Name: addadmin(text, text, integer, text, text, text, bigint, text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addadmin(a_first_name text, a_last_name text, a_level integer, a_user_username text, a_user_password text, a_user_email text, a_admin_id bigint, a_imglink text) RETURNS TABLE(r_id bigint, r_user_id bigint)
    LANGUAGE plpgsql
    AS $$

declare 
temp_user_id bigint := 0;
temp_max_id bigint := 1;
temp_counter bigint := 1;

begin 

if (((select id from adminstrators where id = a_admin_id) is null) or
((select "level" from adminstrators where id = a_admin_id) < 3)) then 
raise exception 'This Admin Is Not Authroized To Create Another Admin!' using errcode = '28000';
end if;
if (((select id from adminstrators where id = a_admin_id) < 4) and 
 a_level >= 3) then 
raise exception 'A Level 3 Admin can only be created by the Main Admin' using errcode = '28000';
end if;
if ((select id from users where username = a_user_username) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Username Already Exist In The Database Try Another!';
end if;
if ((select id from users where "password" = a_user_password) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Password Already Exist In The Database Try Another!';
end if;

if ((select id from users where email = a_user_email) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Email Already Exist In The Database Try Another!';
end if;
select addusertouserstable into temp_user_id from addusertouserstable(a_user_username,a_user_password,a_user_email,3);
select Max(adminstrators.id) into temp_max_id from adminstrators;
if (temp_max_id is null ) then temp_max_id = 1; end if;
for j in 1.. temp_max_id
loop
if ((select id from adminstrators where id = j) is null ) then 
exit;
end if;
if j <> temp_max_id  then
temp_counter := temp_counter + 1;
end if;
end loop;
if temp_max_id != temp_counter then
insert into adminstrators (id , first_name , last_name , "level",  user_id, img_link)
values (temp_counter , a_first_name, a_last_name , a_level, temp_user_id, a_imglink);
else 
insert into adminstrators ( first_name , last_name , "level",  user_id, img_link)
values ( a_first_name, a_last_name , a_level, temp_user_id,a_imglink)
returning adminstrators.id into temp_counter;
end if;
 create temporary table result_table(admin_id bigint,
user_id bigint);
insert into result_table( admin_id,
user_id)
values (temp_counter, temp_user_id);
return query
select * FROM result_table;
end;
$$;


ALTER FUNCTION "Flight_Project".addadmin(a_first_name text, a_last_name text, a_level integer, a_user_username text, a_user_password text, a_user_email text, a_admin_id bigint, a_imglink text) OWNER TO postgres;

--
-- Name: addairline(text, bigint, numeric, text, text, text, text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addairline(a_name text, a_country_id bigint, a_overallscore numeric, a_user_username text, a_user_password text, a_user_email text, a_imglink text) RETURNS TABLE(r_id bigint, r_user_id bigint)
    LANGUAGE plpgsql
    AS $$

declare 
temp_user_id bigint := 0;
temp_max_id bigint := 1;
temp_counter bigint := 1;

begin 
if ((select id from airline_companies where "name" = a_name) is not null) then 
raise exception 'This company name already exists please try another' using ERRCODE = '22000';
end if;

if ((select id from users where username = a_user_username) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Username Already Exist In The Database Try Another!';
end if;
if ((select id from users where "password" = a_user_password) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Password Already Exist In The Database Try Another!';
end if;
if (a_overallscore < 0 or 10 < a_overallscore) then 
raise exception 'Score Needs to be Between 0-10' using ERRCODE = '22000';
end if;

if ((select id from users where email = a_user_email) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Email Already Exist In The Database Try Another!';
end if;
select addusertouserstable into temp_user_id from addusertouserstable(a_user_username,a_user_password,a_user_email,2);
select Max(ac.id) into temp_max_id from airline_companies as ac;
if (temp_max_id is null ) then temp_max_id = 1; end if;
for j in 1.. temp_max_id
loop
if ((select id from airline_companies where id = j) is null ) then 
exit;
end if;
if j <> temp_max_id  then
temp_counter := temp_counter + 1;
end if;
end loop;
if temp_max_id != temp_counter then
insert into airline_companies (id , "name" , country_id, user_id, img_link, overall_score)
values (temp_counter , a_name, a_country_id , temp_user_id, a_imglink, scorerounder(a_overallscore));
else 
insert into airline_companies (  "name", country_id, user_id, img_link, overall_score)
values ( a_name, a_country_id , temp_user_id, a_imglink, scorerounder(a_overallscore))
returning airline_companies.id into temp_counter;
end if;
create temporary table result_table(airline_id bigint,
user_id bigint);
insert into result_table( airline_id,
user_id)
values (temp_counter, temp_user_id);
return query
select * FROM result_table;
end;
$$;


ALTER FUNCTION "Flight_Project".addairline(a_name text, a_country_id bigint, a_overallscore numeric, a_user_username text, a_user_password text, a_user_email text, a_imglink text) OWNER TO postgres;

--
-- Name: addairlinecreationrequest(text, bigint, text, text, text, text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addairlinecreationrequest(company_name text, country_id bigint, a_username text, a_password text, a_email text, a_company_description text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
declare
temp_max_id bigint := 1;
temp_counter bigint := 1;

    BEGIN  
	   
	    if ((select id from users where
	    username = a_username or
	    "password" = a_password ) is not null) then 
raise exception 'Either This Username or this Password Already Exist,Please Try Another!' using ERRCODE = '22000';
end if;
if ((select id from users where
	    email = a_email) is not null) then 
raise exception 'This Email Already Exist, Please Try Another!' using ERRCODE = '22000';
end if;
if ((select id from airline_companies  where
	    "name" = company_name) is not null) then 
raise exception 'This Company Name Already Exist, Please Try Another!' using ERRCODE = '22000';
end if;
        
   select Max(acr.id) into temp_max_id from airline_creation_requests as acr ;
if (temp_max_id is null ) then temp_max_id = 1; end if;
for j in 1.. temp_max_id
loop
if ((select id from airline_creation_requests where id = j) is null ) then 
exit;
end if;
if j <> temp_max_id  then
temp_counter := temp_counter + 1;
end if;
end loop;
if temp_max_id != temp_counter then
insert into airline_creation_requests (id , company_name , country, user_name, "password",email,company_description)
values (temp_counter, company_name, country_id , a_username , a_password , a_email , a_company_description);
else 
insert into airline_creation_requests (  company_name , country, user_name, "password",email,company_description)
values ( company_name, country_id , a_username , a_password , a_email , a_company_description)
returning airline_creation_requests.id into temp_counter;
end if;
return temp_counter;
end;
    $$;


ALTER FUNCTION "Flight_Project".addairlinecreationrequest(company_name text, country_id bigint, a_username text, a_password text, a_email text, a_company_description text) OWNER TO postgres;

--
-- Name: addcountry(text, text, integer, integer); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addcountry(a_name text, a_imglink text, a_lat integer, a_lon integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 
temp_max_id bigint := 1;
temp_counter bigint := 1;

begin 
if ((select id from countries where "name" = a_name) is not null) then 
raise exception 'This Country Name already exist' using ERRCODE = '22000';
end if;
select Max(c.id) into temp_max_id from countries as c;
if (temp_max_id is null ) then temp_max_id = 1; end if;
for j in 1.. temp_max_id
loop
if ((select id from countries where id = j) is null ) then 
exit;
end if;
if j <> temp_max_id  then
temp_counter := temp_counter + 1;
end if;
end loop;
if temp_max_id != temp_counter then
insert into countries  (id , "name", img_link, latitude ,longitude)
values (temp_counter , a_name, a_imglink, a_lat,a_lon );
else 
insert into countries ("name", img_link, latitude ,longitude)
values ( a_name, a_imglink, a_lat ,a_lon)
returning countries.id into temp_counter;
end if;
return temp_counter;
end;
$$;


ALTER FUNCTION "Flight_Project".addcountry(a_name text, a_imglink text, a_lat integer, a_lon integer) OWNER TO postgres;

--
-- Name: addcustomer(text, text, text, text, text, boolean, text, text, text, text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addcustomer(a_first_name text, a_last_name text, a_adress text, a_phone_no text, a_credit_card_no text, a_gender boolean, a_user_username text, a_user_password text, a_user_email text, a_imglink text) RETURNS TABLE(r_id bigint, r_user_id bigint)
    LANGUAGE plpgsql
    AS $$
declare 
temp_user_id bigint := 0;
record_id integer := 0 ;
max_id integer := 1;
counter bigint:= 1;

begin 
if ((select c.id from customers as c where phone_no = a_phone_no) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This phone number already exists try another!';
end if;
if ((select c.id from customers as c where credit_card_no = a_credit_card_no) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This credit card number already exists try another!';
end if;
if ((select id from users where username = a_user_username) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Username Already Exist In The Database Try Another!';
end if;
if ((select id from users where "password" = a_user_password) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Password Already Exist In The Database Try Another!';
end if;

if ((select id from users where email = a_user_email) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Email Already Exist In The Database Try Another!';
end if;
select addusertouserstable into temp_user_id from addusertouserstable(a_user_username,a_user_password,a_user_email,1);
select Max(customers.id) into max_id from customers;
if (max_id is null ) then max_id = 1; end if;
for j in 1.. max_id
loop
if (select customers.id from customers where customers.id = j) is null then 
exit;
end if;
if j <> max_id  then
counter := counter + 1;
end if;
end loop;
if max_id != counter then
insert into customers ("id" , first_name, last_name, address, phone_no, credit_card_no, user_id, gender,img_link)
values (counter , a_first_name, a_last_name, a_adress, a_phone_no, a_credit_card_no, temp_user_id, a_gender,a_imglink)
returning customers.id into counter;
else 
insert into customers ( first_name, last_name, address, phone_no, credit_card_no, user_id, gender,img_link)
values (a_first_name, a_last_name, a_adress, a_phone_no, a_credit_card_no, temp_user_id, a_gender,a_imglink)
returning customers.id into counter;
end if;
create temporary table result_table(cus_id bigint,
user_id bigint);
insert into result_table( cus_id,
user_id)
values (counter, temp_user_id);
return query
select * FROM result_table;
end;
$$;


ALTER FUNCTION "Flight_Project".addcustomer(a_first_name text, a_last_name text, a_adress text, a_phone_no text, a_credit_card_no text, a_gender boolean, a_user_username text, a_user_password text, a_user_email text, a_imglink text) OWNER TO postgres;

--
-- Name: addflight(bigint, bigint, bigint, timestamp without time zone, timestamp without time zone, integer, integer); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addflight(a_airline_company_id bigint, a_origin_country_id bigint, a_destination_country_id bigint, a_departure_time timestamp without time zone, a_landing_time timestamp without time zone, a_remaning_tickets integer, a_price integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 

record_id bigint := 0 ;
max_id bigint :=1;
counter bigint:= 1;

begin 
	
	
if(a_remaning_tickets <= 0) then
raise exception using ERRCODE = '23505', MESSAGE ='cannot create flight with zero or negative number of tickets';
end if;
if(a_landing_time <= a_departure_time) then
raise exception using ERRCODE = '23505', MESSAGE ='cannot create flight with a landing time sooner than the departure time';
end if;

if((select id from airline_companies where id = a_airline_company_id) is null) then 
raise exception using ERRCODE = '02000', MESSAGE ='cannot create flight with an airlinecompany that dosent exist';
end if;

if((select id from countries where id = a_origin_country_id) is null) then 
raise exception using ERRCODE = '02000', MESSAGE ='cannot create flight with an origin country that dosent exist';
end if;

if((select id from countries where id = a_destination_country_id) is null) then 
raise exception using ERRCODE = '02000', MESSAGE ='cannot create flight with an destination country that dosent exist';
end if;

if( a_price < 0) then 
raise exception using ERRCODE = '23505', MESSAGE ='cannot insert flight with a negative price';
end if;
	

select Max(id) into max_id from flights  ;
if (max_id is null ) then max_id = 1; end if;
for j in 1.. max_id
loop
if (select id from flights where id = j) is null then 
exit;
end if;
if j <> max_id  then
counter := counter + 1;
end if;
end loop;

if max_id != counter then

insert into flights (id , airlinecompany_id, origin_country_id, destination_country_id, departure_time, landing_time, remaining_tickets, price, createdat)
values ( counter ,a_airline_company_id , a_origin_country_id , a_destination_country_id 
,a_departure_time, a_landing_time, a_remaning_tickets, a_price, now()::timestamp );
return counter;

else 

insert into flights ( airlinecompany_id, origin_country_id, destination_country_id, departure_time, landing_time, remaining_tickets, price, createdat)
values (a_airline_company_id , a_origin_country_id , a_destination_country_id 
,a_departure_time , a_landing_time, a_remaning_tickets, a_price, now()::timestamp )
returning id into counter;
return  counter;

end if;

end;
$$;


ALTER FUNCTION "Flight_Project".addflight(a_airline_company_id bigint, a_origin_country_id bigint, a_destination_country_id bigint, a_departure_time timestamp without time zone, a_landing_time timestamp without time zone, a_remaning_tickets integer, a_price integer) OWNER TO postgres;

--
-- Name: addreview(text, bigint, bigint, numeric); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addreview(a_description text, a_airline_id bigint, a_customer_id bigint, a_score numeric) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 
temp_max_id bigint := 1;
temp_counter bigint := 1;

begin 
	
if ((select id from airline_companies where id = a_airline_id) is  null) then 
raise exception 'This Airline Does not exist' using ERRCODE = '02000';
end if;

if ((select id from customers where id = a_customer_id) is  null) then 
raise exception 'This Customers Does not exist' using ERRCODE = '02000';
end if;	
if (a_score < 0 or 10 < a_score) then 
raise exception 'Score Needs to be Between 0-10' using ERRCODE = '22000';
end if;


select Max(r.id) into temp_max_id from reviews as r;
if (temp_max_id is null ) then temp_max_id = 1; end if;
for j in 1.. temp_max_id
loop
if ((select id from reviews where id = j) is null ) then 
exit;
end if;
if j <> temp_max_id  then
temp_counter := temp_counter + 1;
end if;
end loop;
if temp_max_id != temp_counter then
insert into reviews  (id , description , airline_id , customer_id ,score,createat)
values (temp_counter , a_description, a_airline_id , a_customer_id ,scorerounder(a_score), now() );
else 
insert into reviews (description , airline_id , customer_id ,score, createat)
values (a_description, a_airline_id , a_customer_id ,scorerounder(a_score),  now())
returning reviews.id into temp_counter;
end if;
return temp_counter;
end;
$$;


ALTER FUNCTION "Flight_Project".addreview(a_description text, a_airline_id bigint, a_customer_id bigint, a_score numeric) OWNER TO postgres;

--
-- Name: addticket(bigint, bigint, integer, text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addticket(a_flight_id bigint, a_customer_id bigint, a_points integer, a_stripe_id text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 

record_id integer := 0 ;
max_id integer :=1;
counter integer:= 1;
temp_cost integer := 0;
temp_spended_points integer := 0;
temp_price integer := 0;

begin 

if ((select remaining_tickets from flights where id = a_flight_id) = 0) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'Cannot Purchase Tickets to this flight cause there are no tickets left';
end if;
if ((select points from customers where id = a_customer_id) < a_points ) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'Not Enough Points to consume the requested amount';
end if;
select Max(id) into max_id from tickets  ;
if (max_id is null ) then max_id = 1; end if;
for j in 1.. max_id
loop
if (select id from tickets where id = j) is null then 
exit;
end if;
if j <> max_id  then
counter := counter + 1;
end if;
end loop;

select price into temp_price from flights where id = a_flight_id;

if ( temp_price <= a_points ) then
temp_spended_points = temp_price;
else
temp_spended_points = a_points;
end if;
temp_cost = temp_price - temp_spended_points;
update flights 
set remaining_tickets = (select remaining_tickets from flights where id = a_flight_id) - 1
where id = a_flight_id;

update customers 
set points = (select points from customers where id = a_customer_id) - temp_spended_points
where id = a_customer_id;

if max_id != counter then
insert into tickets (id , flight_id, customer_id, "cost", stripe_id, createdat)
values ( counter , a_flight_id, a_customer_id,temp_cost, a_stripe_id , NOW()::timestamp );
return counter;
else 
insert into tickets ( flight_id, customer_id, "cost", stripe_id, createdat)
values (a_flight_id, a_customer_id, temp_cost, a_stripe_id, NOW()::timestamp )
returning id into counter;
return  counter;

end if;

end;
$$;


ALTER FUNCTION "Flight_Project".addticket(a_flight_id bigint, a_customer_id bigint, a_points integer, a_stripe_id text) OWNER TO postgres;

--
-- Name: addusertouserstable(text, text, text, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".addusertouserstable(p_username text, p_password text, p_email text, p_user_role bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 

record_id bigint := 0 ;
max_id integer :=1;
counter bigint:= 1;

begin 
if ((select id from users  where username = lower(p_username) or "password" = lower(p_password)) is not null) then 
raise exception 'This Username Or Password already exists please try another' using ERRCODE = '22000';
end if;
if ((select id from users  where email = lower(p_email)) is not null) then 
raise exception 'This Email already exists please try another' using ERRCODE = '22000';
end if;
select Max(users.id) into max_id from users;
if (max_id is null ) then max_id = 1; end if;
for j in 1.. max_id
loop
if (select id from users where id = j) is null then 
exit;
end if;
if j <> max_id  then
counter := counter + 1;
end if;
end loop;

if max_id != counter then

insert into users (id , username , "password" , email ,user_role)
values (counter , lower(p_username), lower(p_password), lower(p_email), p_user_role);
return counter;

else 

insert into users (  username , "password" , email ,user_role)
values (lower(p_username), lower(p_password), lower(p_email), p_user_role)
returning id into counter;
return counter;

end if;

end;
$$;


ALTER FUNCTION "Flight_Project".addusertouserstable(p_username text, p_password text, p_email text, p_user_role bigint) OWNER TO postgres;

--
-- Name: cleanflightsandticketstohistory(); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".cleanflightsandticketstohistory() RETURNS TABLE(r_flights_count bigint, r_tickets_count bigint)
    LANGUAGE plpgsql
    AS $$
declare
temp_flights_ids_to_be_deleted bigint[];
temp_flights_count bigint :=0;
temp_tickets_count bigint :=0;
begin 
	
	/*Identify Flights Ids That Need To Be Removed a.k.a more than 10 days old)*/
	select array_agg(id) into temp_flights_ids_to_be_deleted from flights where landing_time < current_date - interval '3 day';
    /*Transfer The Old Tickets To The History Table*/
	insert into ticket_history (flight_id,customer_id,"cost",stripe_id,createdat,original_id)
	(select t.flight_id ,t.customer_id ,t."cost" ,t.stripe_id ,t.createdat ,t.id from tickets as t where t.flight_id = any(temp_flights_ids_to_be_deleted));
    /*Remove Old Ticket From Tickets Table*/
   WITH deleted AS( delete from tickets where flight_id = any(temp_flights_ids_to_be_deleted) returning *)SELECT count(*) into temp_tickets_count from deleted ;
   /*Transfer The Old Flights To The History Table*/
   insert into flights_history (airlinecompany_id, origin_country_id,destination_country_id,departure_time,landing_time,remaining_tickets,price,original_id,createdat)
	(select 
	f.airlinecompany_id ,
	f.origin_country_id ,
	f.destination_country_id ,
	f.departure_time ,
	f.landing_time ,
	f.remaining_tickets ,
	f.price ,
	f.id ,
	f.createdat 
from flights as f where f.id = any(temp_flights_ids_to_be_deleted));

     /*Remove Old Flights From Flights Table*/
 WITH deleted AS(   delete from flights where id = any(temp_flights_ids_to_be_deleted) returning *)SELECT count(*) into temp_flights_count from deleted;
drop table if exists result_table;
create temporary table result_table(flightC bigint,
ticketsC bigint);
insert into result_table( flightC,
ticketsC)
values (temp_flights_count, temp_tickets_count);
return query
(select * FROM result_table);
end;
$$;


ALTER FUNCTION "Flight_Project".cleanflightsandticketstohistory() OWNER TO postgres;

--
-- Name: getadmin(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getadmin(a_admin_id bigint, a_user_id bigint) RETURNS TABLE(r_id bigint, r_firstname text, r_lastname text, r_level integer, r_user_id bigint, r_user_username text, r_user_email text, r_imglink character varying)
    LANGUAGE plpgsql
    AS $$
declare 

begin 
if ((select a.id from adminstrators as a where a.id = a_admin_id or a.user_id = a_user_id) is null) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'This Admin Dosent Exist';
end if;

return query
select
a.id,
a.first_name,
a.last_name,
a."level",
a.user_id,
u.username,
u.email,
a.img_link 
from adminstrators as a
inner join users as u on a.user_id = u.id 
where
a.id = a_admin_id or 
a.user_id  = a_user_id;
end;
$$;


ALTER FUNCTION "Flight_Project".getadmin(a_admin_id bigint, a_user_id bigint) OWNER TO postgres;

--
-- Name: getairline(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getairline(a_airline_id bigint, a_user_id bigint) RETURNS TABLE(r_id bigint, r_name text, r_country_id bigint, r_country_name text, r_user_id bigint, r_user_username text, r_user_password text, r_user_email text, r_imglink character varying, r_overallscore numeric)
    LANGUAGE plpgsql
    AS $$
declare 

begin 
if ((select ac.id from airline_companies  as ac where ac.id = a_airline_id or ac.user_id = a_user_id) is null) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'This Airline Dosent Exist';
end if;
/*dasda*/
return query
select
ac.id ,
ac."name" ,
ac.country_id,
co."name",
ac.user_id,
u.username,
u."password",
u.email,
ac.img_link,
ac.overall_score 

from airline_companies as ac
inner join countries as co on ac.country_id = co.id
inner join users as u on ac.user_id = u.id 
where
ac.id = a_airline_id or 
ac.user_id  = a_user_id;
end;
$$;


ALTER FUNCTION "Flight_Project".getairline(a_airline_id bigint, a_user_id bigint) OWNER TO postgres;

--
-- Name: getallactivetickets(bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallactivetickets(a_customer bigint) RETURNS TABLE(r_ticket_id bigint, r_cost integer, r_flight_id bigint, r_flight_airline_name text, r_flight_origin_country_name text, r_flight_destination_country_name text, r_flight_departure_time timestamp without time zone, r_flight_landing_time timestamp without time zone, r_flight_price integer, r_stripe_id text)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    return query 
	select

t.id as Ticket_id,
t."cost" ,
t.flight_id, 
ac."name",
co2."name" as origin_country_name,
co3."name" as destination_country_name,
f.departure_time,
f.landing_time,
f.price,
t.stripe_id 
from  tickets as t
inner join customers as c on (t.customer_id = c.id and c.id = a_customer)
inner join flights as f on ( (t.flight_id = f.id))
inner join airline_companies as ac on (f.airlinecompany_id = ac.id)
inner join countries as co1 on (ac.country_id = co1.id)
inner join countries as co2 on (f.origin_country_id = co2.id)
inner join countries as co3 on (f.destination_country_id = co3.id);
    end;
    $$;


ALTER FUNCTION "Flight_Project".getallactivetickets(a_customer bigint) OWNER TO postgres;

--
-- Name: getalladmins(text, text, integer, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getalladmins(a_firstname text, a_lastname text, a_level integer, a_executor_id bigint) RETURNS TABLE(r_id bigint, r_firstname text, r_lastname text, r_level integer, r_user_id bigint, r_user_username text, r_user_email text, r_imglink character varying)
    LANGUAGE plpgsql
    AS $$
declare
temp_executor_level integer := 0;
    begin
	   select "level" into temp_executor_level from adminstrators where id = a_executor_id;
	 return query 
	select 
a.id,
a.first_name ,
a.last_name ,
a."level" ,
u.id,
u.username ,
u.email,
a.img_link
from  adminstrators  as a
inner join users as u on a.user_id = u.id 
where
( (a_firstname is null) OR (a.first_name like (concat('%',a_firstname, '%')) )) and 
( (a_lastname is null) OR (a.last_name like (concat('%',a_lastname, '%')) )) and
( (a_level is null) OR (a."level" = a_level ) ) and
(a."level" < temp_executor_level );
    end;
    $$;


ALTER FUNCTION "Flight_Project".getalladmins(a_firstname text, a_lastname text, a_level integer, a_executor_id bigint) OWNER TO postgres;

--
-- Name: getallairlines(text, bigint[]); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallairlines(a_name text, a_countries bigint[]) RETURNS TABLE(r_id bigint, r_name text, r_country_id bigint, r_country_name text, r_user_id bigint, r_user_username text, r_user_password text, r_user_email text, r_imglink character varying, r_overallscore numeric)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    return query 
	select 
ac.id,
ac."name" ,
ac.country_id ,
c."name",
ac.user_id,
u.username,
u."password",
u.email ,
ac.img_link,
ac.overall_score 
from  airline_companies as ac
inner join countries as c on ac.country_id = c.id
inner join users as u on ac.user_id = u.id
where
( (a_name is null) OR (lower(ac."name") like (concat('%',lower(a_name), '%')) )) and 
( (a_countries is null) OR (ac.country_id = any(a_countries) ));
    end;
    $$;


ALTER FUNCTION "Flight_Project".getallairlines(a_name text, a_countries bigint[]) OWNER TO postgres;

--
-- Name: getallcountries(text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallcountries(a_name text) RETURNS TABLE(r_id bigint, r_name text, r_imglink character varying)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    return query 
	select 
c.id,
c."name",
c.img_link 
from  countries as c
where
( (a_name is null) OR (c.name like (concat('%',a_name, '%')) ));
    end;
    $$;


ALTER FUNCTION "Flight_Project".getallcountries(a_name text) OWNER TO postgres;

--
-- Name: getallcustomers(text, text, text, boolean); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallcustomers(a_firstname text, a_lastname text, a_address text, a_gender boolean) RETURNS TABLE(r_id bigint, r_firstname text, r_lastname text, r_address text, r_phone_no text, r_credit_card text, r_gender boolean, r_points integer, r_user_id bigint, r_user_username text, r_user_password text, r_user_email text, r_imglink character varying)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    return query 
	select 
c.id,
c.first_name,
c.last_name ,
c.address ,
c.phone_no ,
c.credit_card_no ,
c.gender ,
c.points ,
c.user_id ,
u.username,
u."password" ,
u.email,
c.img_link 
from  customers  as c
inner join users as u on c.user_id = u.id 
where
( (a_firstname is null) OR (lower(c.first_name) like (concat('%',lower(a_firstname), '%')) )) and 
( (a_lastname is null) OR (lower(c.last_name) like (concat('%',lower(a_lastname), '%')) )) and
( (a_address is null) OR (lower(c.address) like (concat('%',lower(a_address), '%')) ) ) and 
( (a_gender is null) or c.gender = a_gender);
    end;
    $$;


ALTER FUNCTION "Flight_Project".getallcustomers(a_firstname text, a_lastname text, a_address text, a_gender boolean) OWNER TO postgres;

--
-- Name: getallflights(bigint[], integer, integer, bigint[], bigint[], timestamp without time zone, timestamp without time zone); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallflights(a_airlines bigint[], a_min_price integer, a_max_price integer, a_origin_countries bigint[], a_destination_countries bigint[], a_departure_time timestamp without time zone, a_landing_time timestamp without time zone) RETURNS TABLE(r_id bigint, r_airline_id bigint, r_airline_name text, r_airline_country_id bigint, r_airline_country_name text, r_origin_country_id bigint, r_origin_country_name text, r_origin_country_lat integer, r_origin_country_lon integer, r_destination_country_id bigint, r_destination_country_name text, r_destination_country_lat integer, r_destination_country_lon integer, r_departure_time timestamp without time zone, r_landing_time timestamp without time zone, r_remaining_tickets integer, r_price integer)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    return query 
	select 
f.id,
al.id,
al."name",
al.country_id,
co1."name",
f.origin_country_id,
co2."name",
co2.latitude ,
co2.longitude,
f.destination_country_id,
co3."name",
co3.latitude,
co3.longitude,
f.departure_time,
f.landing_time,
f.remaining_tickets,
f.price 
from  flights as f
inner join airline_companies as al on ( (a_airlines is null) and  (f.airlinecompany_id = al.id)) OR (f.airlinecompany_id = al.id and al.id = any(a_airlines))
inner join countries as co1 on (al.country_id = co1.id)
inner join countries as co2 on ( (a_origin_countries is null) and  (f.origin_country_id = co2.id)) OR (f.origin_country_id = co2.id and co2.id = any(a_origin_countries))
inner join countries as co3 on ( (a_destination_countries is null) and  (f.destination_country_id = co3.id)) OR (f.destination_country_id = co3.id and co3.id = any(a_destination_countries))
where
( (a_min_price is null) OR f.price >= a_min_price) and 
( (a_max_price is null) OR f.price <= a_max_price) and
( (a_departure_time is null) or f.departure_time >= a_departure_time) and 
( (a_landing_time is null) or f.landing_time <= a_landing_time)
;
    end;
    $$;


ALTER FUNCTION "Flight_Project".getallflights(a_airlines bigint[], a_min_price integer, a_max_price integer, a_origin_countries bigint[], a_destination_countries bigint[], a_departure_time timestamp without time zone, a_landing_time timestamp without time zone) OWNER TO postgres;

--
-- Name: getallreviewsbyairline(bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallreviewsbyairline(a_airline_id bigint) RETURNS TABLE(r_id bigint, r_airline_name text, r_description character varying, r_customer_user_id bigint, r_customer_firstname text, r_customer_lastname text, r_customer_imglink character varying, r_score numeric, r_createat timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	 return query 
	select 
r.id,
ac.name,
r.description ,
c.user_id ,
c.first_name ,
c.last_name ,
c.img_link, 
r.score ,
r.createat 
from  reviews  as r
inner join customers as c on c.id = r.customer_id
inner join airline_companies as ac on r.airline_id = ac.id
where
r.airline_id = a_airline_id;
    end;
    
$$;


ALTER FUNCTION "Flight_Project".getallreviewsbyairline(a_airline_id bigint) OWNER TO postgres;

--
-- Name: getallticketsbycustomer(bigint, timestamp without time zone, timestamp without time zone); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallticketsbycustomer(a_customer bigint, a_min_depart_time timestamp without time zone, a_max_depart_time timestamp without time zone) RETURNS TABLE(r_ticket_id bigint, r_cost integer, r_flight_id bigint, r_flight_airline_name text, r_flight_origin_country_name text, r_flight_destination_country_name text, r_flight_departure_time timestamp without time zone, r_flight_landing_time timestamp without time zone, r_flight_price integer, r_stripe_id text)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    return query 
	select

t.id as Ticket_id,
t."cost" ,
t.flight_id, 
ac."name",
co2."name" as origin_country_name,
co3."name" as destination_country_name,
f.departure_time,
f.landing_time,
f.price,
t.stripe_id 
from  tickets as t
inner join customers as c on (t.customer_id = c.id and c.id = a_customer)
inner join flights as f on ( 
(t.flight_id = f.id)  and 
( (a_min_depart_time is null) or f.departure_time >= a_min_depart_time  ) and  
( (a_max_depart_time is null) or f.departure_time <= a_max_depart_time  )
)
inner join airline_companies as ac on (f.airlinecompany_id = ac.id)
inner join countries as co1 on (ac.country_id = co1.id)
inner join countries as co2 on (f.origin_country_id = co2.id)
inner join countries as co3 on (f.destination_country_id = co3.id);
    end;
    $$;


ALTER FUNCTION "Flight_Project".getallticketsbycustomer(a_customer bigint, a_min_depart_time timestamp without time zone, a_max_depart_time timestamp without time zone) OWNER TO postgres;

--
-- Name: getallticketsbyflight(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallticketsbyflight(a_flight_id bigint, a_airline_id bigint) RETURNS TABLE(r_ticket_id bigint, r_cost integer, r_customer_id bigint, r_customer_firstname text, r_customer_lastname text, r_customer_address text, r_customer_phone_no text, r_customer_gender boolean, r_customer_imglink character varying, r_customer_user_id bigint)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    
	    
if ((select id from flights where id = a_flight_id and airlinecompany_id = a_airline_id) is null) then 
raise exception 'This Flight Does not Belong To This Airline' using errcode = '28000';
end if;
	    return query 
	select 
t.id as Ticket_id,
t."cost" ,
c.id as customer_id,
c.first_name,
c.last_name,
c.address,
c.phone_no,
c.gender,
c.img_link,
c.user_id
from  tickets as t
inner join customers as c on (t.customer_id = c.id and t.flight_id = a_flight_id);
    end;
    
$$;


ALTER FUNCTION "Flight_Project".getallticketsbyflight(a_flight_id bigint, a_airline_id bigint) OWNER TO postgres;

--
-- Name: getallticketshistory(bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getallticketshistory(a_customer bigint) RETURNS TABLE(r_ticket_id bigint, r_cost integer, r_flight_id bigint, r_flight_airline_name text, r_flight_origin_country_name text, r_flight_destination_country_name text, r_flight_departure_time timestamp without time zone, r_flight_landing_time timestamp without time zone, r_flight_price integer, r_stripe_id text)
    LANGUAGE plpgsql
    AS $$
declare

    begin
	    return query 
	select

t.original_id as Ticket_id,
t."cost" ,
t.flight_id, 
ac."name",
co2."name" as origin_country_name,
co3."name" as destination_country_name,
f.departure_time,
f.landing_time,
f.price,
t.stripe_id 
from  ticket_history as t
inner join customers as c on (t.customer_id = c.id and c.id = a_customer)
inner join flights_history as f on ( 
(t.flight_id = f.original_id)
)
inner join airline_companies as ac on (f.airlinecompany_id = ac.id)
inner join countries as co1 on (ac.country_id = co1.id)
inner join countries as co2 on (f.origin_country_id = co2.id)
inner join countries as co3 on (f.destination_country_id = co3.id);
    end;
    $$;


ALTER FUNCTION "Flight_Project".getallticketshistory(a_customer bigint) OWNER TO postgres;

--
-- Name: getcustomer(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getcustomer(a_customer_id bigint, a_user_id bigint) RETURNS TABLE(r_id bigint, r_firstname text, r_lastname text, r_address text, r_phoneno text, r_credit_card text, r_gender boolean, r_points integer, r_user_id bigint, r_user_username text, r_user_password text, r_user_email text, r_imglink character varying)
    LANGUAGE plpgsql
    AS $$
declare 

begin 
if ((select c.id from customers as c where c.id = a_customer_id or c.user_id = a_user_id) is null) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'This Customer Dosent Exist';
end if;

return query
select
c.id,
c.first_name,
c.last_name,
c.address,
c.phone_no,
c.credit_card_no,
c.gender,
c.points,
u.id,
u.username,
u."password",
u.email,
c.img_link

from customers as c
inner join users as u on c.user_id = u.id 
where
c.id = a_customer_id or 
c.user_id  = a_user_id;
end;
$$;


ALTER FUNCTION "Flight_Project".getcustomer(a_customer_id bigint, a_user_id bigint) OWNER TO postgres;

--
-- Name: getflight(bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".getflight(a_flight_id bigint) RETURNS TABLE(r_id bigint, r_airline_id bigint, r_airline_name text, r_airline_country_name text, r_origin_country_name text, r_origin_country_lat integer, r_origin_country_lon integer, r_destination_country_name text, r_destination_country_lat integer, r_destination_country_lon integer, r_departure_time timestamp without time zone, r_landing_time timestamp without time zone, r_remaining_tickets integer, r_price integer)
    LANGUAGE plpgsql
    AS $$
declare 


begin 
if ((select f.id from flights  as f where id = a_flight_id) is null) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'This Flight Dosent Exist';
end if;

return query
select
f.id,
f.airlinecompany_id,
ac."name" ,
co1."name" ,
co2."name" ,
co2.latitude,
co2.longitude ,
co3."name" ,
co3.latitude ,
co3.longitude ,
f.departure_time ,
f.landing_time ,
f.remaining_tickets ,
f.price 
from flights as f
inner join airline_companies as ac on f.airlinecompany_id = ac.id
inner join countries as co1 on ac.country_id = co1.id
inner join countries as co2 on f.origin_country_id = co2.id 
inner join countries as co3 on f.destination_country_id = co3.id
where
f.id = a_flight_id;
end;
$$;


ALTER FUNCTION "Flight_Project".getflight(a_flight_id bigint) OWNER TO postgres;

--
-- Name: populateusersroles(); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".populateusersroles() RETURNS void
    LANGUAGE plpgsql
    AS $$

declare 

begin

insert into users_role (id, role_name) values (1, 'Customer');
insert into users_role (id, role_name) values (2, 'AirlineCompany');
insert into users_role (id, role_name) values (3, 'Administrator');

end;
$$;


ALTER FUNCTION "Flight_Project".populateusersroles() OWNER TO postgres;

--
-- Name: removeadmin(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".removeadmin(a_id bigint, a_exectuer_id bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
declare
temp_user_id bigint := 0;
begin 
	
if (select id from adminstrators  where id = a_id) is null then 
raise exception using ERRCODE = '02000', MESSAGE ='this admin cannot be deleted cause i dosent exist';
end if;
if ((select "level" from adminstrators where id = a_exectuer_id) < 2) then 
raise exception using ERRCODE = '28000', MESSAGE ='This Admin Is not authorized to delete this Admin';
end if;
	


select user_id into temp_user_id from adminstrators a  where id = a_id;
delete from adminstrators where id = a_id;
delete from users where id = temp_user_id;
return a_id;
end;
$$;


ALTER FUNCTION "Flight_Project".removeadmin(a_id bigint, a_exectuer_id bigint) OWNER TO postgres;

--
-- Name: removeairline(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".removeairline(a_airline_id bigint, a_admin_id bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
declare
temp_user_id bigint := 0;
temp_flights_ids bigint[];
begin 
	
if (select id from airline_companies where id = a_airline_id) is null then 
raise exception using ERRCODE = '02000', MESSAGE ='this airline cannot be deleted cause i dosent exist';
end if;
if ((select "level" from adminstrators where id = a_admin_id) < 2) then 
raise exception using ERRCODE = '28000', MESSAGE ='This Admin Is not authorized to delete Customers';
end if;
	


select user_id into temp_user_id from airline_companies  where id = a_airline_id;
select array_agg(id) into temp_flights_ids from flights where airlinecompany_id = a_airline_id;

delete from tickets where flight_id = any(temp_flights_ids);
delete from reviews where airline_id = a_airline_id;
delete from flights where airlinecompany_id = a_airline_id;
delete from airline_companies where id = a_airline_id;
delete from users where id = temp_user_id;
return a_airline_id;
end;
$$;


ALTER FUNCTION "Flight_Project".removeairline(a_airline_id bigint, a_admin_id bigint) OWNER TO postgres;

--
-- Name: removecountry(bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".removecountry(a_countryid bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
declare
temp_user_ids bigint[];
temp_flights_ids bigint[];
begin 
	
if (select id from countries  where id = a_countryid) is null then 
raise exception using ERRCODE = '02000', MESSAGE ='this country cannot be deleted cause i dosent exist';
end if;

select array_agg(id) into temp_flights_ids from flights where origin_country_id =a_countryid or destination_country_id = a_countryid;
delete from tickets where flight_id = any(temp_flights_ids);
delete from flights where id = any(temp_flights_ids);
select array_agg(ac.user_id ) into temp_user_ids from airline_companies ac  where country_id = a_countryid;
delete from airline_companies where  country_id = a_countryid;
delete from users where id = any(temp_user_ids);
delete from countries where id = a_countryid;




return a_countryid;
end;
$$;


ALTER FUNCTION "Flight_Project".removecountry(a_countryid bigint) OWNER TO postgres;

--
-- Name: removecustomer(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".removecustomer(a_customer_id bigint, a_admin_id bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
declare
temp_user_id bigint := 0;
begin 
	
if (select id from customers where id = a_customer_id) is null then 
raise exception using ERRCODE = '02000', MESSAGE ='this customer cannot be deleted cause i dosent exist';
end if;
if (select level from adminstrators where id = a_admin_id) < 2 then 
raise exception using ERRCODE = '28000', MESSAGE ='This Admin Is not authorized to delete Customers';
end if;
	


select user_id into temp_user_id from customers where id = a_customer_id;

delete from tickets where customer_id = a_customer_id;
delete from reviews where customer_id  = a_customer_id;
delete from customers where id = a_customer_id;
delete from users where id = temp_user_id;
return a_customer_id;
end;
$$;


ALTER FUNCTION "Flight_Project".removecustomer(a_customer_id bigint, a_admin_id bigint) OWNER TO postgres;

--
-- Name: removeflight(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".removeflight(a_flight_id bigint, a_airline_id bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
declare 
begin 
	
if (select id from flights  where id = a_flight_id) is null then 
raise exception using ERRCODE = 00001, MESSAGE ='this flight cannot be deleted cause it dosent exist';
end if;
	
if (((select airlinecompany_id from flights where id = a_flight_id) != a_airline_id)) then 
raise exception using ERRCODE = 00002, MESSAGE ='this airline cannot delete this flight cause it isnt hers to delete';
end if;



delete from tickets where flight_id = a_flight_id;
delete from flights where id = a_flight_id;
return a_flight_id ;

end;
$$;


ALTER FUNCTION "Flight_Project".removeflight(a_flight_id bigint, a_airline_id bigint) OWNER TO postgres;

--
-- Name: removeticket(bigint, bigint); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".removeticket(a_id bigint, a_customer_id bigint) RETURNS TABLE(r_ticket_id bigint, r_stripe_id text)
    LANGUAGE plpgsql
    AS $$
declare 
begin 
	
	if (select id from flights as f where f.id = (select flight_id from tickets  where id = a_id) and f.departure_time > now()) is null then 
raise exception using ERRCODE = '23505', MESSAGE ='Cannot Remove Ticket To Flight That Has Already Departed';
end if;
	
if (select id from tickets  where id = a_id) is null then 
raise exception using ERRCODE = '02000', MESSAGE ='this Ticket cannot be deleted cause it dosent exist';
end if;
if (select customer_id from tickets  where id = a_id and customer_id = a_customer_id) is null then 
raise exception using ERRCODE = '28000', MESSAGE ='This Ticket Belongs To a Different Customer Therefore Cant Be Deleted!';
end if;
	
return query
with deletedTicket as(delete from tickets where id = a_id
returning *) select 
deletedTicket.id,
deletedTicket.stripe_id
from deletedTicket;

end;
$$;


ALTER FUNCTION "Flight_Project".removeticket(a_id bigint, a_customer_id bigint) OWNER TO postgres;

--
-- Name: scorerounder(numeric); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".scorerounder(numericscore numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $$

declare 
temp_decimal_part numeric := 0;
temp_new_decimal_part numeric :=0;

begin 
select (numericScore % 1) into temp_decimal_part;
if( temp_decimal_part < 0.25 ) then
return ROUND(numericScore);
end if;
if( 0.75 <temp_decimal_part) then
return ceil(numericScore);

else
return ceil(numericScore) - 0.5;
end if;

end;
$$;


ALTER FUNCTION "Flight_Project".scorerounder(numericscore numeric) OWNER TO postgres;

--
-- Name: threerandomreview(); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".threerandomreview() RETURNS TABLE(r_id bigint, r_description character varying, r_customer_user_id bigint, r_customer_firstname text, r_customer_lastname text, r_customer_imglink character varying, r_airline_name text, r_score numeric, r_createat timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
declare
temp_reviews_count bigint := 0;
temp_all_reviews_ids bigint[];
    begin
	   drop table if exists result_table;
	 select array_agg(id) into temp_all_reviews_ids   from reviews;  
     select count(*) into temp_reviews_count from reviews;
	
	  create temporary table result_table(rr_id bigint,
rr_description varchar , rr_customer_user_id bigint, rr_customer_firstname text,
rr_customer_lastname text, rr_customer_imglink character varying,
										  rr_airline_name text, rr_score numeric,
rr_createat timestamp without time zone);

for j in 1.. 3
loop
insert into result_table( rr_id ,
rr_description  , rr_customer_user_id , rr_customer_firstname,
rr_customer_lastname , rr_customer_imglink,rr_airline_name, rr_score , rr_createat)
select 
r.id ,
r.description ,
c.user_id ,
c.first_name ,
c.last_name ,
c.img_link,
ac."name" ,
r.score ,
r.createat 
from  reviews  as r
inner join customers as c on c.id = r.customer_id
inner join airline_companies as ac on ac.id = r.airline_id 
where
r.id = (select temp_all_reviews_ids[ceil(random()*(temp_reviews_count - 2))]) ;

end loop;
return query
select * FROM result_table;
    end;
    
$$;


ALTER FUNCTION "Flight_Project".threerandomreview() OWNER TO postgres;

--
-- Name: trylogin(text, text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".trylogin(a_username text, a_password text) RETURNS TABLE(r_user_id bigint, r_user_role integer)
    LANGUAGE plpgsql
    AS $$
declare

    BEGIN  
	    return query
        select u.id, u.user_role from users as u  where 
       (lower(username) = lower(a_username) and lower("password") = lower(a_password));          
    end;
    
$$;


ALTER FUNCTION "Flight_Project".trylogin(a_username text, a_password text) OWNER TO postgres;

--
-- Name: updateadmin(bigint, text, text, integer, text, text, text, bigint, character varying); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".updateadmin(a_id bigint, a_firstname text, a_lastname text, a_level integer, a_user_username text, a_user_password text, a_user_email text, a_updating_admin_id bigint, a_imglink character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 

temp_user_id bigint := 0 ;

begin 


if ((select id  from adminstrators where id = a_id) is null ) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'Admin Does Not Exist In The Database';
end if;

if (( (select "level" from adminstrators where id = a_updating_admin_id) < 3) and 
a_updating_admin_id != a_id
) then 
raise exception USING ERRCODE = '28000', MESSAGE = 'Only Admins Level 3 or Higher can Update Other Admins';
end if;

if (((select "level" from adminstrators where id = a_updating_admin_id) = 3) and 
(select "level" from adminstrators where id = a_id) > 2
) then 
raise exception USING ERRCODE = '28000', MESSAGE = 'You can only Update Yourself or lower levels admins';
end if;

select user_id into temp_user_id from adminstrators where id = a_id;

if ((select id from users where username = a_user_username) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Username Already Exist In The Database Try Another!';
end if;
if ((select id from users where "password" = a_user_password) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Password Already Exist In The Database Try Another!';
end if;

if ((select id from users where email = a_user_email) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Email Already Exist In The Database Try Another!';
end if;
	
	update adminstrators 
	set first_name = case when a_firstname is null then first_name when a_firstname is not null then a_firstname end,
	last_name = case when a_lastname is null then last_name when a_lastname is not null then a_lastname end,
	"level" = case when a_level is null then "level" when a_level is not null then a_level end,	
	img_link = case when a_imglink is null then img_link when a_imglink is not null then a_imglink end
	where adminstrators.id = a_id;

   update users
   set username = case when a_user_username is null then username when a_user_username is not null then a_user_username end,
   "password" = case when a_user_password is null then "password" when a_user_password is not null then a_user_password end,
   email  = case when a_user_email is null then email when a_user_email is not null then a_user_email end
   where id = temp_user_id;


	

   return a_id;
end;
$$;


ALTER FUNCTION "Flight_Project".updateadmin(a_id bigint, a_firstname text, a_lastname text, a_level integer, a_user_username text, a_user_password text, a_user_email text, a_updating_admin_id bigint, a_imglink character varying) OWNER TO postgres;

--
-- Name: updateairline(bigint, text, bigint, text, text, text, character varying); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".updateairline(a_airlinecompany_id bigint, a_name text, a_country_id bigint, a_username text, a_password text, a_email text, a_imglink character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 

temp_user_id bigint := 0 ;

begin 
	
if ((select id from airline_companies where id = a_airlinecompany_id) is null) then 
raise exception using ERRCODE = '02000', MESSAGE = 'No Airlines with this id exist in the Database';
end if;

select user_id
into temp_user_id
from airline_companies  
where airline_companies.id = a_airlinecompany_id;

if ((select id from users where username = a_username) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Username Already Exist In The Database Try Another!';
end if;
if ((select id from users where "password" = a_password) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Password Already Exist In The Database Try Another!';
end if;

if ((select id from users where email = a_email) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Email Already Exist In The Database Try Another!';
end if;


update users 
set username = case when a_username is null then username when a_username is not null then a_username end,
 "password" = case when a_password is null then "password" when a_password is not null then a_password end,
 email =  case when a_email is null then email when a_email is not null then a_email end
where id = temp_user_id;

	
	update airline_companies 
	set "name" = case when a_name is null then "name" when a_name is not null then a_name end,
	country_id = case when a_country_id is null then country_id when a_country_id is not null then a_country_id end,
	img_link = case when a_imglink is null then img_link when a_imglink is not null then a_imglink end
		
	where id = a_airlinecompany_id;


   return a_airlinecompany_id;
end;
$$;


ALTER FUNCTION "Flight_Project".updateairline(a_airlinecompany_id bigint, a_name text, a_country_id bigint, a_username text, a_password text, a_email text, a_imglink character varying) OWNER TO postgres;

--
-- Name: updatecountry(bigint, text, text); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".updatecountry(a_id bigint, a_name text, a_imglink text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 


begin 


if ((select id  from countries where id = a_id) is null ) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'Country Does Not Exist In The Database';
end if;
if ((select id from countries where "name" = a_name) is not null) then 
raise exception 'This Country Name already exist' using ERRCODE = '22000';
end if;


	
	update countries 
	set "name" = case when a_name is null then "name" when a_name is not null then a_name end,
	img_link = case when a_imglink is null then img_link when a_imglink is not null then a_imglink end
	where countries.id = a_id;



	

   return a_id;
end;
$$;


ALTER FUNCTION "Flight_Project".updatecountry(a_id bigint, a_name text, a_imglink text) OWNER TO postgres;

--
-- Name: updatecustomer(bigint, text, text, text, text, text, boolean, integer, text, text, text, character varying); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".updatecustomer(a_customer_id bigint, a_customer_first_name text, a_customer_last_name text, a_customer_adress text, a_customer_phone_no text, a_customer_credit_card_no text, a_customer_gender boolean, a_customer_points integer, a_customer_user_username text, a_customer_user_password text, a_customer_user_email text, a_imglink character varying) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 

temp_user_id bigint := 0 ;

begin 


if ((select id  from customers where id = a_customer_id) is null ) then 
raise exception USING ERRCODE = '02000', MESSAGE = 'Customer Does Not Exist In The Database';
end if;

select user_id into temp_user_id from customers where id = a_customer_id;

if ((select id from users where username = a_customer_user_username) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Username Already Exist In The Database Try Another!';
end if;
if ((select id from users where "password" = a_customer_user_password) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Password Already Exist In The Database Try Another!';
end if;

if ((select id from users where email = a_customer_user_email) is not null) then 
raise exception USING ERRCODE = '23505', MESSAGE = 'This Email Already Exist In The Database Try Another!';
end if;
	
	update customers 
	set first_name = case when a_customer_first_name is null then first_name when a_customer_first_name is not null then a_customer_first_name end,
	last_name = case when a_customer_last_name is null then last_name when a_customer_last_name is not null then a_customer_last_name end,
	address = case when a_customer_adress is null then address when a_customer_adress is not null then a_customer_adress end,
	phone_no = case when a_customer_phone_no is null then phone_no when a_customer_phone_no is not null then a_customer_phone_no end,
	credit_card_no = case when a_customer_credit_card_no is null then credit_card_no when a_customer_credit_card_no is not null then a_customer_credit_card_no end,
	gender = case when a_customer_gender is null then gender when a_customer_gender is not null then a_customer_gender end,
	points = case when a_customer_points is null then points when a_customer_points is not null then a_customer_points end,
	img_link = case when a_imglink is null then img_link when a_imglink is not null then a_imglink end
	where customers.id = a_customer_id;

   update users
   set username = case when a_customer_user_username is null then username when a_customer_user_username is not null then a_customer_user_username end,
   "password" = case when a_customer_user_password is null then "password" when a_customer_user_password is not null then a_customer_user_password end,
   email  = case when a_customer_user_email is null then email when a_customer_user_email is not null then a_customer_user_email end
   where id = temp_user_id;


	

   return a_customer_id;
end;
$$;


ALTER FUNCTION "Flight_Project".updatecustomer(a_customer_id bigint, a_customer_first_name text, a_customer_last_name text, a_customer_adress text, a_customer_phone_no text, a_customer_credit_card_no text, a_customer_gender boolean, a_customer_points integer, a_customer_user_username text, a_customer_user_password text, a_customer_user_email text, a_imglink character varying) OWNER TO postgres;

--
-- Name: updateflight(bigint, bigint, bigint, bigint, timestamp without time zone, timestamp without time zone, integer, integer); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".updateflight(a_id bigint, a_airline_id bigint, a_origin_country_id bigint, a_destination_country_id bigint, a_departure_time timestamp without time zone, a_landing_time timestamp without time zone, a_remaining_tickets integer, a_price integer) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

declare 


begin 
	
if ((select id from flights where id = a_id) is null) then 
raise exception using ERRCODE = 00001, MESSAGE = 'No Flight with this id exist in the Database';
end if;
if ((select id from flights where id = a_id and airlinecompany_id = a_airline_id) is null) then 
raise exception using ERRCODE = 00002, MESSAGE = 'This Flight does not belong to this Airline';
end if;


update flights 
set 
origin_country_id = case when a_origin_country_id is null then origin_country_id when
a_origin_country_id is not null then a_origin_country_id end,
destination_country_id = case when a_destination_country_id is null then destination_country_id when
a_destination_country_id is not null then a_destination_country_id end,
departure_time = case when a_departure_time is null then departure_time when
a_departure_time is not null then a_departure_time end,
landing_time = case when a_landing_time is null then landing_time when
a_landing_time is not null then a_landing_time end,
remaining_tickets = case when a_remaining_tickets is null then remaining_tickets when
a_remaining_tickets is not null then a_remaining_tickets end,
price = case when a_price is null then price when
a_price is not null then a_price end
where id = a_id;

 return a_id;
end;
$$;


ALTER FUNCTION "Flight_Project".updateflight(a_id bigint, a_airline_id bigint, a_origin_country_id bigint, a_destination_country_id bigint, a_departure_time timestamp without time zone, a_landing_time timestamp without time zone, a_remaining_tickets integer, a_price integer) OWNER TO postgres;

--
-- Name: wipedata(); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".wipedata() RETURNS TABLE(r_flights_count bigint, r_tickets_count bigint, r_airlines_count bigint, r_customers_count bigint, r_reviews_count bigint)
    LANGUAGE plpgsql
    AS $$
declare 
temp_flights_count bigint :=0;
temp_tickets_count bigint :=0;
temp_airlines_count bigint :=0;
temp_customers_count bigint :=0;
temp_reviews_count bigint :=0;
begin
	drop table if exists result_table;
WITH deleted AS (DELETE FROM reviews  WHERE true RETURNING *) SELECT count(*) into temp_reviews_count FROM deleted;
WITH deleted AS (DELETE FROM tickets WHERE true RETURNING *) SELECT count(*) into temp_tickets_count FROM deleted;
WITH deleted AS (DELETE FROM customers WHERE true RETURNING *) SELECT count(*) into temp_customers_count FROM deleted;
WITH deleted AS (DELETE FROM flights WHERE true RETURNING *) SELECT count(*) into temp_flights_count FROM deleted;
WITH deleted AS (DELETE FROM airline_companies WHERE true RETURNING *) SELECT count(*) into temp_airlines_count FROM deleted;


 DELETE FROM users WHERE user_role = 2 or user_role = 1;

 
  ALTER SEQUENCE airline_companies_id_seq RESTART WITH 1;
  ALTER SEQUENCE flights_id_seq RESTART WITH 1;
  ALTER SEQUENCE tickets_id_seq RESTART WITH 1;
  ALTER SEQUENCE customers_id_seq RESTART WITH 1;
 ALTER SEQUENCE reviews_id_seq RESTART WITH 1;
 create temporary table result_table(flightC bigint,
ticketsC bigint, airlinesC bigint, customersC bigint, reviewsC bigint);
insert into result_table( flightC,
ticketsC, airlinesC, customersC, reviewsC)
values (temp_flights_count, temp_tickets_count,
temp_airlines_count, temp_customers_count, temp_reviews_count);
return query
select * FROM result_table;
end;
$$;


ALTER FUNCTION "Flight_Project".wipedata() OWNER TO postgres;

--
-- Name: wipeticketandflights(); Type: FUNCTION; Schema: Flight_Project; Owner: postgres
--

CREATE FUNCTION "Flight_Project".wipeticketandflights() RETURNS TABLE(r_flights_count bigint, r_tickets_count bigint)
    LANGUAGE plpgsql
    AS $$
declare 
temp_flights_count bigint :=0;
temp_tickets_count bigint :=0;
begin 
	
WITH deleted AS (DELETE FROM tickets WHERE true RETURNING *) SELECT count(*) into temp_tickets_count FROM deleted;
WITH deleted AS (DELETE FROM flights WHERE true RETURNING *) SELECT count(*) into temp_flights_count FROM deleted;
 ALTER SEQUENCE flights_id_seq RESTART WITH 1;
  ALTER SEQUENCE tickets_id_seq RESTART WITH 1;
 drop table if exists result_table;
  create temporary table result_table(flightC bigint,
ticketsC bigint);
insert into result_table( flightC,
ticketsC)
values (temp_flights_count, temp_tickets_count);
return query
select * FROM result_table;
end;
$$;


ALTER FUNCTION "Flight_Project".wipeticketandflights() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adminstrators; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".adminstrators (
    id bigint NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    level integer NOT NULL,
    user_id bigint NOT NULL,
    img_link character varying
);


ALTER TABLE "Flight_Project".adminstrators OWNER TO postgres;

--
-- Name: adminstrators_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".adminstrators_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".adminstrators_id_seq OWNER TO postgres;

--
-- Name: adminstrators_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".adminstrators_id_seq OWNED BY "Flight_Project".adminstrators.id;


--
-- Name: airline_companies; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".airline_companies (
    id bigint NOT NULL,
    name text,
    country_id bigint NOT NULL,
    user_id bigint,
    img_link character varying,
    overall_score numeric(10,1) NOT NULL
);


ALTER TABLE "Flight_Project".airline_companies OWNER TO postgres;

--
-- Name: airline_companies_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".airline_companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".airline_companies_id_seq OWNER TO postgres;

--
-- Name: airline_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".airline_companies_id_seq OWNED BY "Flight_Project".airline_companies.id;


--
-- Name: airline_creation_requests; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".airline_creation_requests (
    id bigint NOT NULL,
    company_name text NOT NULL,
    country bigint NOT NULL,
    user_name text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    company_description text
);


ALTER TABLE "Flight_Project".airline_creation_requests OWNER TO postgres;

--
-- Name: airline_creation_requests_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".airline_creation_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".airline_creation_requests_id_seq OWNER TO postgres;

--
-- Name: airline_creation_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".airline_creation_requests_id_seq OWNED BY "Flight_Project".airline_creation_requests.id;


--
-- Name: countries; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".countries (
    id bigint NOT NULL,
    name text NOT NULL,
    img_link character varying,
    latitude integer NOT NULL,
    longitude integer NOT NULL
);


ALTER TABLE "Flight_Project".countries OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".countries_id_seq OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".countries_id_seq OWNED BY "Flight_Project".countries.id;


--
-- Name: customers; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".customers (
    id bigint NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    address text NOT NULL,
    phone_no text NOT NULL,
    credit_card_no text NOT NULL,
    user_id bigint NOT NULL,
    gender boolean DEFAULT true NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    img_link character varying
);


ALTER TABLE "Flight_Project".customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".customers_id_seq OWNED BY "Flight_Project".customers.id;


--
-- Name: flights; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".flights (
    id bigint NOT NULL,
    airlinecompany_id bigint NOT NULL,
    origin_country_id bigint NOT NULL,
    destination_country_id bigint NOT NULL,
    departure_time timestamp(0) without time zone NOT NULL,
    landing_time timestamp(0) without time zone NOT NULL,
    remaining_tickets integer NOT NULL,
    price integer DEFAULT 0 NOT NULL,
    createdat timestamp(0) without time zone NOT NULL
);


ALTER TABLE "Flight_Project".flights OWNER TO postgres;

--
-- Name: flights_history; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".flights_history (
    id bigint NOT NULL,
    airlinecompany_id bigint NOT NULL,
    origin_country_id integer NOT NULL,
    destination_country_id integer NOT NULL,
    departure_time timestamp(0) without time zone NOT NULL,
    landing_time timestamp(0) without time zone NOT NULL,
    remaining_tickets integer NOT NULL,
    price integer DEFAULT 0 NOT NULL,
    original_id bigint NOT NULL,
    createdat timestamp(0) without time zone NOT NULL
);


ALTER TABLE "Flight_Project".flights_history OWNER TO postgres;

--
-- Name: flights_history_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".flights_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".flights_history_id_seq OWNER TO postgres;

--
-- Name: flights_history_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".flights_history_id_seq OWNED BY "Flight_Project".flights_history.id;


--
-- Name: flights_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".flights_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".flights_id_seq OWNER TO postgres;

--
-- Name: flights_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".flights_id_seq OWNED BY "Flight_Project".flights.id;


--
-- Name: reviews; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".reviews (
    id bigint NOT NULL,
    description character varying NOT NULL,
    airline_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    score numeric(10,1) NOT NULL,
    createat timestamp(0) without time zone NOT NULL
);


ALTER TABLE "Flight_Project".reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".reviews_id_seq OWNED BY "Flight_Project".reviews.id;


--
-- Name: ticket_history; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".ticket_history (
    id bigint NOT NULL,
    flight_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    cost integer DEFAULT 0 NOT NULL,
    stripe_id text NOT NULL,
    createdat timestamp(0) without time zone,
    original_id bigint NOT NULL
);


ALTER TABLE "Flight_Project".ticket_history OWNER TO postgres;

--
-- Name: ticket_history_customer_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".ticket_history_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".ticket_history_customer_id_seq OWNER TO postgres;

--
-- Name: ticket_history_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".ticket_history_customer_id_seq OWNED BY "Flight_Project".ticket_history.customer_id;


--
-- Name: ticket_history_flight_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".ticket_history_flight_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".ticket_history_flight_id_seq OWNER TO postgres;

--
-- Name: ticket_history_flight_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".ticket_history_flight_id_seq OWNED BY "Flight_Project".ticket_history.flight_id;


--
-- Name: ticket_history_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".ticket_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".ticket_history_id_seq OWNER TO postgres;

--
-- Name: ticket_history_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".ticket_history_id_seq OWNED BY "Flight_Project".ticket_history.id;


--
-- Name: tickets; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".tickets (
    id bigint NOT NULL,
    flight_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    cost integer DEFAULT 0 NOT NULL,
    stripe_id text NOT NULL,
    createdat timestamp(0) without time zone
);


ALTER TABLE "Flight_Project".tickets OWNER TO postgres;

--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".tickets_id_seq OWNER TO postgres;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".tickets_id_seq OWNED BY "Flight_Project".tickets.id;


--
-- Name: users; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".users (
    id bigint NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    user_role integer NOT NULL
);


ALTER TABLE "Flight_Project".users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".users_id_seq OWNED BY "Flight_Project".users.id;


--
-- Name: users_role; Type: TABLE; Schema: Flight_Project; Owner: postgres
--

CREATE TABLE "Flight_Project".users_role (
    id integer NOT NULL,
    role_name character varying NOT NULL
);


ALTER TABLE "Flight_Project".users_role OWNER TO postgres;

--
-- Name: users_role_id_seq; Type: SEQUENCE; Schema: Flight_Project; Owner: postgres
--

CREATE SEQUENCE "Flight_Project".users_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Flight_Project".users_role_id_seq OWNER TO postgres;

--
-- Name: users_role_id_seq; Type: SEQUENCE OWNED BY; Schema: Flight_Project; Owner: postgres
--

ALTER SEQUENCE "Flight_Project".users_role_id_seq OWNED BY "Flight_Project".users_role.id;


--
-- Name: adminstrators id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".adminstrators ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".adminstrators_id_seq'::regclass);


--
-- Name: airline_companies id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_companies ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".airline_companies_id_seq'::regclass);


--
-- Name: airline_creation_requests id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_creation_requests ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".airline_creation_requests_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".countries ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".countries_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".customers ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".customers_id_seq'::regclass);


--
-- Name: flights id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".flights ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".flights_id_seq'::regclass);


--
-- Name: flights_history id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".flights_history ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".flights_history_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".reviews ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".reviews_id_seq'::regclass);


--
-- Name: ticket_history id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".ticket_history ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".ticket_history_id_seq'::regclass);


--
-- Name: ticket_history flight_id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".ticket_history ALTER COLUMN flight_id SET DEFAULT nextval('"Flight_Project".ticket_history_flight_id_seq'::regclass);


--
-- Name: ticket_history customer_id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".ticket_history ALTER COLUMN customer_id SET DEFAULT nextval('"Flight_Project".ticket_history_customer_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".tickets ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".tickets_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".users_id_seq'::regclass);


--
-- Name: users_role id; Type: DEFAULT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users_role ALTER COLUMN id SET DEFAULT nextval('"Flight_Project".users_role_id_seq'::regclass);


--
-- Data for Name: adminstrators; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".adminstrators (id, first_name, last_name, level, user_id, img_link) FROM stdin;
4	VAEWQ96A	8M8F9M8	1	34	\N
5	YULH6UQF	IA35X6L	2	35	\N
6	U78TY6MG	UBL70QK	3	36	\N
7	JHT4T3G4	PM6F0BN	1	37	\N
8	V1KBN76C	IDLPGOW	2	38	\N
9	X71HS0A8	OUKIXN4	1	39	\N
10	0AAEDLX1	R0DYJ61	2	40	\N
11	0JFU4O9Y	OU05FSJ	3	41	\N
12	DOJA51PF	0HEFBIQ	2	42	\N
13	MU6MVTRF	1XXPZ0G	1	43	\N
14	0REW9RQH	2LMZOXH	3	44	\N
15	MCB938Z0	H770IWU	2	45	\N
16	I12GUN6W	PM8UIRT	3	46	\N
17	BI4W16JV	ASESWR4	3	47	\N
18	EQ7LECDJ	CVRY6S9	3	48	\N
19	WE0OGXPA	C6SOJRB	3	49	\N
20	3FS83WR2	RF69ECF	3	50	\N
21	LENYPMOZ	D8O0R2R	1	51	\N
22	28ML9YX5	04OOW7R	1	52	\N
23	4XW2FXEW	TBWYQ48	3	53	\N
24	UY4UQINP	8SUY3XG	2	54	\N
25	K1OZ02QN	QGMGWAQ	3	55	\N
26	QGHJUIHC	HQDPZHE	1	56	\N
27	3PN5Q9HL	YD9N6RT	3	57	\N
28	PX6FV2MW	VQKCBGQ	1	58	\N
29	H1KDWUN6	D80UV8I	1	59	\N
30	6P3MTT84	VX9X62A	3	60	\N
1	KHJN9F3F	VM2UK26	2	31	\N
10000	Gustavo	Fring	3	10002	\N
0	Main	Admin	4	0	\N
\.


--
-- Data for Name: airline_companies; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".airline_companies (id, name, country_id, user_id, img_link, overall_score) FROM stdin;
2	Konopelski PLC	2	114	https://avatars.dicebear.com/api/jdenticon/ZDC6S.svg	8.5
4	Zulauf-Pfannerstill	14	116	https://avatars.dicebear.com/api/gridy/QMICE.svg	4.5
5	Streich, Gutkowski and Rosenbaum	3	117	https://avatars.dicebear.com/api/gridy/TOVFQ.svg	3.5
6	Considine PLC	8	118	https://avatars.dicebear.com/api/gridy/O94QK.svg	3.5
7	Brekke and Sons	14	119	https://avatars.dicebear.com/api/jdenticon/BLFPK.svg	6.5
8	Blanda-Erdman	12	120	https://avatars.dicebear.com/api/jdenticon/A2EYV.svg	4.0
9	McCullough LLC	6	121	https://avatars.dicebear.com/api/gridy/TYBNE.svg	4.5
10	Hilpert-Hermann	7	122	https://avatars.dicebear.com/api/identicon/H8W4L.svg	8.5
11	Hagenes, Eichmann and Schimmel	13	123	https://avatars.dicebear.com/api/jdenticon/XCAQZ.svg	9.0
12	Tromp-Koelpin	2	124	https://avatars.dicebear.com/api/identicon/44SUC.svg	0.5
13	Klocko, Mante and Gleason	5	125	https://avatars.dicebear.com/api/jdenticon/GU4UG.svg	3.5
14	Mayer-Oberbrunner	11	126	https://avatars.dicebear.com/api/gridy/EDBA7.svg	8.5
15	Towne, Luettgen and Prosacco	6	127	https://avatars.dicebear.com/api/identicon/HRV6Q.svg	5.0
16	Rodriguez, Dietrich and Brakus	9	128	https://avatars.dicebear.com/api/gridy/XDNYQ.svg	3.5
17	Ryan, Pfeffer and Cronin	5	129	https://avatars.dicebear.com/api/gridy/KT1VF.svg	1.0
18	Keebler-Pagac	12	130	https://avatars.dicebear.com/api/jdenticon/XYEHH.svg	7.5
19	Nolan Inc	14	131	https://avatars.dicebear.com/api/gridy/PZMBL.svg	7.0
20	Grady, Dicki and Baumbach	6	132	https://avatars.dicebear.com/api/gridy/JIL33.svg	0.0
21	Bergstrom, Koelpin and Nienow	6	133	https://avatars.dicebear.com/api/gridy/T8PGL.svg	7.0
22	Kunze and Sons	4	134	https://avatars.dicebear.com/api/identicon/MPOUH.svg	9.5
23	Windler PLC	6	135	https://avatars.dicebear.com/api/identicon/P72LO.svg	9.5
24	Beer-Stiedemann	31	136	https://avatars.dicebear.com/api/identicon/NS88H.svg	8.0
25	Cremin Ltd	7	137	https://avatars.dicebear.com/api/identicon/ZMCT6.svg	3.5
26	Bayer, Emard and Gislason	14	138	https://avatars.dicebear.com/api/jdenticon/IRA0V.svg	7.5
27	Roberts, Bayer and Sporer	6	139	https://avatars.dicebear.com/api/jdenticon/EFWX2.svg	7.0
28	Renner-Kling	12	140	https://avatars.dicebear.com/api/gridy/F7KBA.svg	9.5
29	Schroeder, Schamberger and Nitzsche	3	141	https://avatars.dicebear.com/api/identicon/CBJR7.svg	9.0
30	Walker and Sons	31	142	https://avatars.dicebear.com/api/jdenticon/FPXAU.svg	1.5
31	Konopelski-Pollich	9	143	https://avatars.dicebear.com/api/gridy/T76ZQ.svg	7.0
32	Runolfsson-Kling	14	144	https://avatars.dicebear.com/api/gridy/THU6U.svg	7.5
33	Hettinger, Cummerata and Fahey	13	145	https://avatars.dicebear.com/api/jdenticon/757QK.svg	1.0
34	Ullrich and Sons	10	146	https://avatars.dicebear.com/api/jdenticon/GXZWG.svg	0.0
35	Robel-Hermann	3	147	https://avatars.dicebear.com/api/jdenticon/HU8PB.svg	5.0
36	Stracke, Dooley and Hammes	1	148	https://avatars.dicebear.com/api/gridy/OA13C.svg	4.5
37	Beier, Willms and Kessler	9	149	https://avatars.dicebear.com/api/jdenticon/6H26A.svg	0.5
38	Wilderman, Vandervort and Lubowitz	4	150	https://avatars.dicebear.com/api/jdenticon/NQZEY.svg	8.0
39	Denesik LLC	3	151	https://avatars.dicebear.com/api/gridy/AZRQV.svg	5.0
40	Hills-Rosenbaum	9	152	https://avatars.dicebear.com/api/jdenticon/D5HF8.svg	6.0
41	Stracke-Aufderhar	1	153	https://avatars.dicebear.com/api/gridy/VQDHC.svg	6.0
42	Hegmann PLC	11	154	https://avatars.dicebear.com/api/identicon/1GKUO.svg	3.5
43	Hilpert, Ruecker and Fritsch	7	155	https://avatars.dicebear.com/api/identicon/RIUFE.svg	4.5
44	Murphy Ltd	12	156	https://avatars.dicebear.com/api/gridy/KLG3P.svg	9.0
45	Yundt-Heidenreich	10	157	https://avatars.dicebear.com/api/gridy/57ZAA.svg	9.0
46	Keebler-Keeling	31	158	https://avatars.dicebear.com/api/jdenticon/1IXMR.svg	4.5
47	Schultz, Grant and Runolfsson	9	159	https://avatars.dicebear.com/api/gridy/1VHNW.svg	4.5
48	Welch, Stanton and Welch	2	160	https://avatars.dicebear.com/api/identicon/QBXSP.svg	8.0
49	Collins, Kuhic and Reichert	6	161	https://avatars.dicebear.com/api/jdenticon/ITRFO.svg	6.5
50	Jacobi-Orn	2	162	https://avatars.dicebear.com/api/jdenticon/9D1UL.svg	9.0
51	Carroll, Brown and Flatley	7	163	https://avatars.dicebear.com/api/jdenticon/HZ5R0.svg	9.0
52	Hackett-Ondricka	7	164	https://avatars.dicebear.com/api/jdenticon/FK4UG.svg	7.5
53	Frami-Brown	2	165	https://avatars.dicebear.com/api/jdenticon/O6P0C.svg	3.5
54	Carter, Thompson and McDermott	9	166	https://avatars.dicebear.com/api/identicon/7N874.svg	7.0
55	Okuneva LLC	31	167	https://avatars.dicebear.com/api/identicon/CXKUD.svg	3.5
56	Conroy Ltd	10	168	https://avatars.dicebear.com/api/jdenticon/TTF6Q.svg	1.5
57	Green Ltd	14	169	https://avatars.dicebear.com/api/identicon/OYYCK.svg	8.0
58	Kemmer and Sons	8	170	https://avatars.dicebear.com/api/identicon/WJIX6.svg	2.0
59	Brekke, Hintz and Hermiston	8	171	https://avatars.dicebear.com/api/jdenticon/EIYAV.svg	1.0
60	Baumbach LLC	9	172	https://avatars.dicebear.com/api/gridy/UJQ8P.svg	7.5
61	Ritchie LLC	1	173	https://avatars.dicebear.com/api/gridy/ELQVO.svg	4.0
62	Reilly, McCullough and Brekke	13	174	https://avatars.dicebear.com/api/identicon/ROJYB.svg	3.0
63	Watsica-Ernser	2	175	https://avatars.dicebear.com/api/gridy/ZJEX5.svg	7.0
64	Mitchell, Fay and Paucek	7	176	https://avatars.dicebear.com/api/identicon/D9WQH.svg	1.5
65	Skiles-Walsh	2	177	https://avatars.dicebear.com/api/gridy/SXOXR.svg	6.5
66	Cassin-Schinner	1	178	https://avatars.dicebear.com/api/gridy/LKFXQ.svg	3.0
67	Johns, Dicki and Orn	6	179	https://avatars.dicebear.com/api/identicon/SW7ZD.svg	0.0
68	Pollich Ltd	14	180	https://avatars.dicebear.com/api/jdenticon/P7N1H.svg	8.5
69	Sporer, Aufderhar and DuBuque	2	181	https://avatars.dicebear.com/api/identicon/1BA8B.svg	3.0
70	O'Keefe, Grady and Mertz	8	182	https://avatars.dicebear.com/api/jdenticon/DIGHC.svg	9.5
71	Quitzon PLC	14	183	https://avatars.dicebear.com/api/jdenticon/JVB34.svg	6.0
72	Hansen-Weber	10	184	https://avatars.dicebear.com/api/gridy/MMKYB.svg	9.5
73	Cartwright-Little	6	185	https://avatars.dicebear.com/api/gridy/ZRS6F.svg	5.0
74	Mann LLC	11	186	https://avatars.dicebear.com/api/identicon/A3EDY.svg	2.5
75	Lueilwitz-Jerde	4	187	https://avatars.dicebear.com/api/identicon/H2UFZ.svg	7.0
76	Wisozk Group	14	188	https://avatars.dicebear.com/api/identicon/UFZOY.svg	2.5
77	Torphy-Keeling	10	189	https://avatars.dicebear.com/api/gridy/Y5UDY.svg	2.0
78	Leannon, Schmidt and Littel	6	190	https://avatars.dicebear.com/api/identicon/JW83K.svg	3.0
79	Anderson PLC	8	191	https://avatars.dicebear.com/api/jdenticon/NKDVD.svg	7.0
80	Yundt, Keeling and Reilly	13	192	https://avatars.dicebear.com/api/jdenticon/1BL94.svg	0.0
81	Ernser-Thiel	3	193	https://avatars.dicebear.com/api/identicon/MJ58G.svg	6.5
82	Balistreri Group	7	194	https://avatars.dicebear.com/api/jdenticon/VKRC2.svg	6.0
83	Schaden-O'Hara	9	195	https://avatars.dicebear.com/api/jdenticon/3X3JG.svg	3.0
84	Maggio, Nolan and Kovacek	2	196	https://avatars.dicebear.com/api/identicon/NFR0F.svg	9.0
85	Goyette, Romaguera and Stanton	2	197	https://avatars.dicebear.com/api/identicon/DXO3J.svg	10.0
86	Weissnat-Cole	31	198	https://avatars.dicebear.com/api/jdenticon/TAZAT.svg	2.0
87	Steuber-Kuhic	4	199	https://avatars.dicebear.com/api/identicon/7YSHE.svg	5.0
88	Cruickshank, Hirthe and Koelpin	7	200	https://avatars.dicebear.com/api/jdenticon/XB1FS.svg	6.5
89	Ortiz PLC	12	201	https://avatars.dicebear.com/api/identicon/2LNRW.svg	5.0
90	Durgan PLC	11	202	https://avatars.dicebear.com/api/identicon/O4AYN.svg	8.5
91	Luettgen LLC	5	203	https://avatars.dicebear.com/api/gridy/2T70T.svg	6.0
92	Bernhard-Franecki	4	204	https://avatars.dicebear.com/api/jdenticon/G9SNB.svg	8.5
93	Lubowitz-Lindgren	9	205	https://avatars.dicebear.com/api/identicon/1MNTJ.svg	3.5
94	Turner, Koelpin and Zboncak	2	206	https://avatars.dicebear.com/api/jdenticon/RZOQK.svg	2.0
95	Hamill and Sons	12	207	https://avatars.dicebear.com/api/jdenticon/PMXX7.svg	6.0
96	Dooley, Veum and Hoppe	10	208	https://avatars.dicebear.com/api/jdenticon/QFOK6.svg	8.5
97	Tremblay PLC	10	209	https://avatars.dicebear.com/api/jdenticon/KEPAL.svg	2.5
98	Sanford, Hahn and Hills	4	228	https://avatars.dicebear.com/api/gridy/GIXVW.svg	6.5
99	Baumbach, Considine and Kassulke	31	229	https://avatars.dicebear.com/api/identicon/FHE5B.svg	4.0
100	Mante LLC	10	230	https://avatars.dicebear.com/api/gridy/E4CRF.svg	8.0
1	Jones, Morar and Upton	5	113	https://avatars.dicebear.com/api/identicon/805MR.svg	1.0
10000	Tommy	20	10001	\N	8.0
3	Labadie LLC	14	115	https://avatars.dicebear.com/api/gridy/6TQPV.svg	7.5
101	dsada	5	232	\N	0.0
\.


--
-- Data for Name: airline_creation_requests; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".airline_creation_requests (id, company_name, country, user_name, password, email, company_description) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".countries (id, name, img_link, latitude, longitude) FROM stdin;
31	Brazil	https://countryflagsapi.com/svg/bra	-22	-43
3	Canada	https://countryflagsapi.com/svg/can	56	-99
4	Switzerland	https://countryflagsapi.com/svg/switzerland	46	8
5	Israel	https://countryflagsapi.com/svg/isr	31	34
7	Ice Land	https://countryflagsapi.com/svg/isl	44	-81
8	Japan	https://countryflagsapi.com/svg/jpn	36	138
9	Russia	https://countryflagsapi.com/svg/rus	60	86
10	Thailand	https://countryflagsapi.com/svg/tha	15	101
1	Uganda	https://countryflagsapi.com/svg/uga	2	32
2	Yemen	https://countryflagsapi.com/svg/yem	14	48
6	South Africa	https://countryflagsapi.com/svg/zaf	-31	22
11	Belgium	https://countryflagsapi.com/svg/bel	50	4
12	Australia	https://countryflagsapi.com/svg/aus	-24	135
13	Tanzania	https://countryflagsapi.com/svg/tza	-7	34
14	France	https://countryflagsapi.com/png/fra	2	47
20	Britain	Britain	51	0
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".customers (id, first_name, last_name, address, phone_no, credit_card_no, user_id, gender, points, img_link) FROM stdin;
40	Purdy	Paulson	58483 Molly Creek Apt. 042\nN	1337072	5544795397705671	69	f	148	https://robohash.org/CAVJM?set=set1
9	Luettgen	Blick	8390 Johathan Center\nB	8778554	4716133940516178	9	f	69	https://robohash.org/PXAA8?set=set1
26	Yost	Benjamin	411 Leif Parkways Apt. 076	5373059	4929634815126	26	f	62	https://robohash.org/CEOLK?set=set2
14	Brekke	Shayne	00504 Trenton Drive Suite 77	0320304	4556005786675	14	t	93	https://robohash.org/RWPFI?set=set3
48	Bartell	Ebba	483 Ruecker Port Apt. 829\n	8625356	4024007184019072	77	f	39	https://robohash.org/M5U2H?set=set3
42	Schroeder	Hermann	962 Ronny Vista Suite 348\n	4562257	5423010627737411	71	t	137	https://robohash.org/P7DKB?set=set1
4	Schulist	Prohaska	446 Reinger Villages Suite 10	3280113	5534036400096325	4	t	81	https://robohash.org/K3ZBE?set=set1
13	Rogahn	Walker	4275 Cathryn Street Apt. 195	9584951	4916580576241927	13	f	7	https://robohash.org/DBNW2?set=set3
34	Emard	Muller	540 Kaela Keys Suite 296\n	6793469	5251590633752543	63	t	72	https://robohash.org/TY7SB?set=set3
5	McGlynn	Bartoletti	6385 Adan Stravenue\n	9486762	5177554357945767	5	t	111	https://robohash.org/TV864?set=set3
39	Sauer	Karli	7006 Medhurst Garden	8470854	5157457146517828	68	f	24	https://robohash.org/0TFIW?set=set1
20	Gerlach	Schuppe	355 Diamond Hill\nGo	1127726	5542260953528951	20	t	33	https://robohash.org/DQLPK?set=set3
33	Olson	Dooley	4314 Bernadine Green Apt. 780\n	1064508	4485454560213832	62	f	95	https://robohash.org/8F4I9?set=set2
8	Tremblay	Macejkovic	9880 Neil Mountains\nB	5893709	5264384366995569	8	f	178	https://robohash.org/DB2SF?set=set1
12	Fadel	Lilian	98762 Chaya Vista Suite 99	5466777	4539766378065443	12	t	38	https://robohash.org/M5OYB?set=set1
47	Ruecker	Williamson	11072 Burnice Flats	0885451	6011709159178763	76	t	25	https://robohash.org/K7AE3?set=set2
28	Casper	Merl	67908 Kulas Forest\n	1155666	4532639990769949	28	t	152	https://robohash.org/VJ770?set=set1
45	Keeling	Jacobson	147 Helga Stream\nMaye	3684717	348686200540299	74	f	185	https://robohash.org/TLJP4?set=set2
35	Hills	Kiehn	1305 Jailyn Landing\nP	1931413	6011630244354567	64	f	143	https://robohash.org/SPA2J?set=set2
19	Kihn	Bechtelar	77101 Stanton Brooks Suite 292\nC	7228570	6011061905915464	19	t	20	https://robohash.org/M1HYA?set=set3
30	Dibbert	Schiller	951 Pfannerstill Green Suite	1176941	4929140333564	30	t	177	https://robohash.org/HF69A?set=set3
43	Herman	Stamm	27167 Parker Court Apt. 7	6132575	5548109113757493	72	t	45	https://robohash.org/IVYZ7?set=set3
37	Volkman	Baumbach	67174 Wunsch Cliffs\nEast	1827321	349226606982354	66	t	160	https://robohash.org/QITXS?set=set3
50	Tromp	Gleichner	9728 Mae Bridge Apt. 171	3115176	5311215273704988	79	t	149	https://robohash.org/B3WKE?set=set2
46	Olson	Amber	236 Schmeler Station Suite 212	0966798	4539786006521	75	t	38	https://robohash.org/EN6BK?set=set2
29	Quigley	Halvorson	44241 Waylon Stravenue\n	0772576	4912681664761	29	f	138	https://robohash.org/SX3CW?set=set3
31	Gulgowski	Cheyanne	183 Fabiola Drive\nNew	5083964	5461438334371419	33	f	142	https://robohash.org/8X7VW?set=set3
36	Deckow	Dock	058 Kirlin Dam Suite 	3419854	4485493841109	65	t	138	https://robohash.org/LK77R?set=set3
11	Walter	Kilback	75019 Fahey Port Suite 49	1194907	5184376552580822	11	f	22	https://robohash.org/H7Y2X?set=set3
49	Schumm	Roberts	1353 Damon Street Apt. 41	3412535	5556409182247585	78	f	17	https://robohash.org/ZS9YN?set=set1
16	Muller	Koss	0982 Kristy Burgs Apt. 179	6210283	5392372577181090	16	t	89	https://robohash.org/6RQXZ?set=set3
15	Vandervort	Alexandrine	0674 Will Circles Apt. 	2377440	5439888781833387	15	f	174	https://robohash.org/T7AGN?set=set1
27	Marks	Streich	6517 Mitchell Plains\nF	1832393	5555814180291744	27	f	16	https://robohash.org/9KRZI?set=set3
7	Harvey	VonRueden	924 King Mission\nPo	1407131	5369038712131444	7	t	165	https://robohash.org/UIELI?set=set2
25	Jacobi	Rohan	17539 Boehm Drives Suite 2	3171891	5377183199422203	25	t	122	https://robohash.org/DH0ZK?set=set3
18	Moore	Travis	317 Schowalter Vista	8819882	4024007182790849	18	t	182	https://robohash.org/G8ZAU?set=set2
23	Stokes	Pagac	8977 Elton Centers\nNort	8449348	5230984311484634	23	t	166	https://robohash.org/Z3J8E?set=set1
32	Steuber	Roob	40343 Anjali Ford\nWest S	3280011	4539735788070	61	f	38	https://robohash.org/XYQCG?set=set2
44	O'Keefe	Daugherty	337 Bernier Key Suite 9	3777057	5213776105127101	73	t	131	https://robohash.org/M80XH?set=set3
10	Ryan	McCullough	555 Hammes Ports Apt. 556\n	6347351	4539635834255	10	f	156	https://robohash.org/7T01H?set=set3
51	Walsh	Wilkinson	75269 Quitzon Circle\n	0093263	5514884194687997	80	f	71	https://robohash.org/DYI3D?set=set3
6	Kessler	Murphy	9533 Brekke Run\nMary	8065226	4532952298118838	6	t	148	https://robohash.org/7TUZC?set=set1
38	Kulas	Missouri	7531 Hudson Squares	0565501	6011129516922946	67	t	145	https://robohash.org/WJ9JB?set=set2
21	Connelly	Dane	7750 Burnice Mission\nEast 	7548708	5254554747408399	21	t	61	https://robohash.org/72PCE?set=set3
41	Mills	Reilly	2861 Kyla Bridge\nEast C	7934112	379754916190130	70	f	177	https://robohash.org/SB2LO?set=set3
88	Keeling	Stehr	8451 Dickinson Cliff\nPo	5851445	4556535145667635	215	f	119	https://robohash.org/I3S6Y?set=set3
82	Lind	Gleason	992 Hamill Underpass Apt	3402039	4556601535996180	112	f	93	https://robohash.org/TUNTS?set=set3
63	Parisian	Padberg	0085 Blair Viaduct\nKat	1382110	6011740972319227	92	f	195	https://robohash.org/2LD3Q?set=set2
1	Paucek	Reynolds	864 Scottie Divide\nAly	1333140	4916647713084146	1	t	0	https://robohash.org/5YQTN?set=set1
3	Roberts	Daisha	2377 Yessenia Meadow\nUllr	1439888	4916345099025	3	f	0	https://robohash.org/VLEH9?set=set1
17	McClure	Kuhlman	703 Tillman Villages	8676339	5587840535272198	17	f	129	https://robohash.org/93W4P?set=set2
95	McKenzie	Glover	101 Lincoln Pike Suite 605\n	1476474	6011426934684094	222	t	63	https://robohash.org/STXWP?set=set2
57	Farrell	Anderson	3930 Camron Roads Apt. 2	3758886	4024007167342046	86	f	105	https://robohash.org/0YEJN?set=set2
94	Bergstrom	Zieme	399 Doyle Green\nKatri	6306028	5523788729953106	221	t	174	https://robohash.org/A49YT?set=set2
67	Blanda	Klein	28102 Mireya Lakes Suite 32	5349467	5183454977701520	96	t	80	https://robohash.org/0WCJJ?set=set3
90	Koepp	Hackett	55816 Rosalia Rapid\nSo	4237664	4556571093979490	217	f	91	https://robohash.org/2ZL7Y?set=set1
65	Schneider	Schimmel	007 Weissnat Rapids\nCr	7089947	5132145849566156	94	t	83	https://robohash.org/F0B62?set=set1
54	Satterfield	Champlin	842 Zboncak Burg Apt. 6	0232184	4532647895125	83	t	125	https://robohash.org/UMBJG?set=set3
22	Weissnat	Altenwerth	88759 Legros Canyon\nEa	6862614	4485124120573633	22	t	31	https://robohash.org/STHV7?set=set3
93	Metz	Reinger	66431 Julian Radial\nWe	3664069	4532411639964	220	t	18	https://robohash.org/OV5IW?set=set3
72	Buckridge	Herzog	345 Eleanora Course Suite 	5865442	5202052985272281	102	t	161	https://robohash.org/JI1VL?set=set3
59	Nikolaus	Schuster	4521 Jermain Landing\nF	0858399	4851438353843687	88	t	166	https://robohash.org/O3NB6?set=set1
69	Nader	Bashirian	863 Bergnaum Lane\nSkil	1714372	6011781036455920	98	t	1	https://robohash.org/4SYLS?set=set2
79	Baumbach	Littel	0430 Boris Harbors\nEa	8908042	5351934020921692	109	t	138	https://robohash.org/V1YGN?set=set2
76	Kuvalis	Flatley	3408 Lauren Walk\nPort 	0347510	4539541418043811	106	t	160	https://robohash.org/WEW49?set=set3
92	Gutmann	Watsica	495 Sheridan Springs Suite 	1065215	5445360716550389	219	t	74	https://robohash.org/N1GTZ?set=set1
98	Gulgowski	Stokes	57039 Esta Fall\nRunt	9085359	5263597939424954	225	t	21	https://robohash.org/G9B9C?set=set3
53	Medhurst	Johnston	03439 Eve Creek\nBrand	4098621	4854297879788314	82	f	164	https://robohash.org/AATGL?set=set3
84	Bauch	Steuber	75426 Kathlyn Stream Suite	9044503	4539085308008	211	f	44	https://robohash.org/YDISH?set=set2
73	Armstrong	Elva	347 Valerie Pines\nMarv	0393052	5124330594063522	103	f	99	https://robohash.org/C12O7?set=set2
55	Hirthe	Pagac	1561 Taya Trail\nSouth 	7024731	4556087390733159	84	t	168	https://robohash.org/7VWZ4?set=set3
91	Hickle	Parker	051 Baumbach Prairi	1723365	5332614696288337	218	t	174	https://robohash.org/T9KM2?set=set1
70	Schumm	Madisyn	0981 Roel Field Suite 874	1304567	4556329431107	99	t	11	https://robohash.org/X2OEN?set=set2
85	Rodriguez	Cruickshank	10748 Gleichner Island	6360418	4916122883446780	212	t	26	https://robohash.org/5W2N0?set=set2
80	Langworth	Bogisich	201 Mertz Bypass\nEast B	9453899	5122807035993864	110	f	80	https://robohash.org/G4SZD?set=set3
60	Homenick	Armstrong	531 Stamm Village\nE	1133513	4532081204495	89	t	124	https://robohash.org/KJ07S?set=set2
64	Bernhard	O'Hara	97446 Rice Spur\nWa	1550512	5365262439217583	93	f	68	https://robohash.org/F3F0E?set=set1
81	Wolf	Jacobi	6914 Henry Expressway Suit	0277666	4485365006716982	111	t	135	https://robohash.org/DD9ZU?set=set3
61	Metz	Cassin	2302 Cleta Burg Apt. 	2811880	5177864503737780	90	f	98	https://robohash.org/HHFI6?set=set2
77	Pouros	Gleichner	2481 Sauer Inlet\nWest	4199710	5498524558740772	107	t	28	https://robohash.org/IDVTD?set=set2
56	Kirlin	Louisa	723 Padberg Union Suite 6	1858088	4539187865391624	85	f	135	https://robohash.org/YIJ6H?set=set1
78	Weber	Reynolds	4481 Lang Isle Apt. 361\nNorth	0089253	341311383531877	108	f	198	https://robohash.org/MNLBA?set=set1
83	Nitzsche	Lessie	9983 Orn Loaf\nAshly	4991577	5360905446631411	210	t	122	https://robohash.org/SF44S?set=set2
52	Kihn	Johnson	666 Reichert Well Suite 974\nNo	5680571	4716904186607230	81	f	73	https://robohash.org/8TIRK?set=set2
87	Boehm	Parker	8260 Huels Mill Suite 4	9460546	4916140226484	214	t	0	https://robohash.org/4MV0C?set=set2
97	Koss	Hackett	94863 Fay Island\nPort	9353552	4024007152214	224	t	150	https://robohash.org/K175T?set=set2
86	Grady	Pfannerstill	059 Maggio Court\nLake L	1560443	5163404578138972	213	t	1	https://robohash.org/XJPWG?set=set2
99	Daniel	Osbaldo	4951 Stark Gardens\n	1126640	5160105275402990	226	f	192	https://robohash.org/KBI8P?set=set3
89	Sawayn	Paucek	53535 Lehner Viaduct Apt.	1269902	5157149576134527	216	f	157	https://robohash.org/5X0I9?set=set1
58	Kilback	Jamil	99934 Stoltenberg Corner Suit	3026015	5117101551291599	87	t	92	https://robohash.org/QBV8V?set=set3
96	Marvin	Jennie	2343 Lea Point\nPort A	1195820	5436772077395751	223	t	30	https://robohash.org/XNCTT?set=set3
66	Rath	Elvis	560 Lilyan Burgs\nQuigl	5318256	4024007177237	95	f	126	https://robohash.org/3C3CU?set=set2
68	Bogan	Emely	458 Rene Loop\nSanti	0098539	4556853240163	97	f	71	https://robohash.org/6PX6L?set=set1
71	Halvorson	Harvey	19979 Mya Forks\nEast Hum	9977813	5592703651285597	101	t	94	https://robohash.org/P71QU?set=set3
75	Fay	Laverna	23832 Concepcion Groves Suite 	5862226	4929184587236565	105	f	100	https://robohash.org/JIJPB?set=set3
100	Dare	Pagac	1050 Crooks Square Apt. 162	0690743	4532439802474832	227	f	65	https://robohash.org/66A34?set=set2
74	Vandervort	Baumbach	6229 Emard Parkway Suite 453\nL	7824552	4916391963686	104	f	142	https://robohash.org/3EIV6?set=set1
62	Greenholt	Koepp	40033 Belle Dam Apt. 696\nPor	0890433	4916637217780	91	f	135	https://robohash.org/L6M1O?set=set1
24	Effertz	Kshlerin	46508 Jaiden Turnpike Suit	0683847	4556387774406	24	t	146	https://robohash.org/QPEK0?set=set1
101	dasdsa	dasdsadsa	dasdsada	dasdasdas	dasdsadsadas	231	t	0	\N
2	Botsford	Becker	57302 Trisha Mountains	1650523	4532433772966612	2	t	0	https://robohash.org/PVGDE?set=set3
\.


--
-- Data for Name: flights; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".flights (id, airlinecompany_id, origin_country_id, destination_country_id, departure_time, landing_time, remaining_tickets, price, createdat) FROM stdin;
24	59	5	12	2022-10-29 15:12:09	2022-10-31 08:32:09	0	393	2022-10-27 01:12:09
20	80	11	7	2022-10-30 10:12:09	2022-10-31 23:04:09	287	200	2022-10-27 01:12:09
18	55	2	10	2022-10-25 13:12:09	2022-10-28 03:03:09	205	376	2022-10-27 01:12:09
35	50	6	1	2022-10-27 04:12:09	2022-10-30 22:04:09	319	259	2022-10-27 01:12:09
13	44	31	2	2022-10-29 17:12:09	2022-10-30 08:19:09	26	136	2022-10-27 01:12:09
17	7	10	12	2022-10-27 02:12:09	2022-10-29 14:37:09	99	89	2022-10-27 01:12:09
49	13	13	31	2022-10-29 19:12:09	2022-10-31 11:06:09	380	98	2022-10-27 01:12:09
26	1	4	8	2022-10-25 07:12:09	2022-10-28 02:11:09	403	290	2022-10-27 01:12:09
4	11	7	10	2022-10-26 10:12:09	2022-10-29 21:40:09	257	220	2022-10-27 01:12:09
15	52	13	8	2022-10-26 21:12:09	2022-10-30 14:31:09	310	241	2022-10-27 01:12:09
40	10	13	1	2022-10-30 06:12:09	2022-11-02 09:47:09	71	178	2022-10-27 01:12:09
44	24	31	9	2022-10-25 04:12:09	2022-10-27 01:36:09	423	366	2022-10-27 01:12:09
32	19	2	8	2022-10-28 09:12:09	2022-10-28 12:42:09	403	191	2022-10-27 01:12:09
42	41	3	7	2022-10-31 15:12:09	2022-11-03 23:09:09	486	293	2022-10-27 01:12:09
37	61	6	11	2022-10-26 03:12:09	2022-10-27 06:37:09	235	350	2022-10-27 01:12:09
48	58	12	8	2022-10-29 09:12:09	2022-10-31 16:33:09	42	214	2022-10-27 01:12:09
33	39	6	11	2022-10-26 09:12:09	2022-10-28 00:00:09	122	96	2022-10-27 01:12:09
7	7	7	6	2022-10-28 11:12:09	2022-10-30 08:06:09	211	289	2022-10-27 01:12:09
5	12	1	11	2022-10-24 04:12:09	2022-10-27 23:05:09	309	271	2022-10-27 01:12:09
9	62	31	7	2022-10-29 03:12:09	2022-11-01 12:34:09	67	40	2022-10-27 01:12:09
6	16	31	9	2022-10-31 17:12:09	2022-11-03 13:12:09	72	298	2022-10-27 01:12:09
8	78	3	9	2022-11-01 20:12:09	2022-11-03 04:53:09	3	83	2022-10-27 01:12:09
29	88	13	7	2022-10-26 06:12:09	2022-10-27 14:48:09	309	362	2022-10-27 01:12:09
47	41	7	10	2022-10-29 20:12:09	2022-10-31 16:23:09	344	235	2022-10-27 01:12:09
14	65	7	2	2022-10-29 10:12:09	2022-10-29 17:20:09	41	361	2022-10-27 01:12:09
38	72	10	7	2022-10-30 05:12:09	2022-11-03 04:12:09	57	375	2022-10-27 01:12:09
43	18	7	3	2022-10-27 12:12:09	2022-10-28 13:15:09	46	281	2022-10-27 01:12:09
31	34	4	9	2022-10-27 05:12:09	2022-10-28 03:14:09	193	300	2022-10-27 01:12:09
50	85	11	8	2022-10-24 00:12:09	2022-10-27 16:00:09	218	290	2022-10-27 01:12:09
46	22	11	10	2022-10-27 12:12:09	2022-10-28 19:39:09	7	380	2022-10-27 01:12:09
\.


--
-- Data for Name: flights_history; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".flights_history (id, airlinecompany_id, origin_country_id, destination_country_id, departure_time, landing_time, remaining_tickets, price, original_id, createdat) FROM stdin;
33	31	11	12	2022-10-21 02:44:05	2022-10-21 04:20:05	96	176	31	2022-10-26 21:45:22
34	93	6	7	2022-10-21 15:44:05	2022-10-21 23:54:05	323	394	34	2022-10-26 21:45:22
35	22	12	5	2022-10-20 19:44:05	2022-10-21 01:13:05	19	154	42	2022-10-26 21:45:22
36	68	6	5	2022-10-22 18:44:05	2022-10-23 14:23:05	175	353	46	2022-10-26 21:45:22
37	18	6	10	2022-10-21 20:44:05	2022-10-22 02:32:05	116	22	48	2022-10-26 21:45:22
38	75	1	12	2022-10-23 08:44:05	2022-10-23 11:54:05	56	272	50	2022-10-26 21:45:22
39	68	9	1	2022-10-21 09:44:05	2022-10-21 13:51:05	178	323	52	2022-10-26 21:45:22
40	16	9	1	2022-10-21 21:44:05	2022-10-22 17:08:05	345	399	57	2022-10-26 21:45:22
41	14	5	7	2022-10-21 05:44:05	2022-10-21 14:26:05	337	131	59	2022-10-26 21:45:22
42	23	8	11	2022-10-22 23:44:05	2022-10-23 14:03:05	397	151	68	2022-10-26 21:45:22
43	12	11	5	2022-10-22 10:44:05	2022-10-23 04:25:05	333	308	74	2022-10-26 21:45:22
44	19	31	1	2022-10-20 05:44:05	2022-10-20 14:11:05	34	21	81	2022-10-26 21:45:22
45	41	1	12	2022-10-23 06:44:05	2022-10-23 11:39:05	155	198	83	2022-10-26 21:45:22
46	33	5	12	2022-10-23 01:44:05	2022-10-23 17:00:05	84	157	7	2022-10-26 21:45:21
47	64	2	11	2022-10-23 12:44:05	2022-10-23 20:55:05	418	8	58	2022-10-26 21:45:22
48	80	9	3	2022-10-20 02:44:05	2022-10-20 08:42:05	124	104	62	2022-10-26 21:45:22
49	67	5	12	2022-10-21 22:44:05	2022-10-22 13:33:05	241	126	64	2022-10-26 21:45:22
50	76	13	1	2022-10-21 12:44:05	2022-10-21 19:08:05	221	44	30	2022-10-26 21:45:22
51	46	13	3	2022-10-20 06:44:05	2022-10-20 20:30:05	267	304	37	2022-10-26 21:45:22
52	46	31	7	2022-10-21 23:44:05	2022-10-22 01:23:05	142	223	26	2022-10-26 21:45:22
53	19	2	31	2022-10-22 02:44:05	2022-10-22 13:32:05	155	197	70	2022-10-26 21:45:22
54	63	3	13	2022-10-22 05:44:05	2022-10-22 07:18:05	327	387	56	2022-10-26 21:45:22
55	14	5	1	2022-10-23 02:44:05	2022-10-23 02:52:05	74	377	71	2022-10-26 21:45:22
56	73	4	7	2022-10-22 10:44:05	2022-10-22 18:52:05	67	342	33	2022-10-26 21:45:22
57	4	4	6	2022-10-21 01:44:05	2022-10-21 09:09:05	477	383	22	2022-10-26 21:45:22
58	92	2	9	2022-10-21 02:44:05	2022-10-21 09:42:05	315	233	55	2022-10-26 21:45:22
59	95	2	12	2022-10-20 15:44:05	2022-10-21 00:55:05	273	377	600	2022-10-26 21:45:19
60	29	4	7	2022-10-22 05:44:05	2022-10-22 23:34:05	62	211	82	2022-10-26 21:45:22
61	61	6	9	2022-10-21 03:44:05	2022-10-21 11:56:05	402	151	1	2022-10-26 21:45:21
62	63	8	31	2022-10-21 18:44:05	2022-10-21 21:04:05	490	158	54	2022-10-26 21:45:22
63	49	12	3	2022-10-22 15:44:05	2022-10-22 19:39:05	442	288	21	2022-10-26 21:45:22
64	52	10	2	2022-10-22 05:44:05	2022-10-23 01:37:05	490	234	80	2022-10-26 21:45:22
65	90	13	1	2022-10-22 09:44:05	2022-10-22 18:15:05	394	134	87	2022-10-26 21:45:22
66	8	13	8	2022-10-20 14:44:05	2022-10-21 05:55:05	400	60	19	2022-10-26 21:45:22
67	72	9	5	2022-10-22 17:44:05	2022-10-23 00:05:05	100	77	73	2022-10-26 21:45:22
68	53	12	6	2022-10-21 04:44:05	2022-10-21 06:23:05	211	385	39	2022-10-26 21:45:22
69	37	13	9	2022-10-21 10:44:05	2022-10-21 15:44:05	257	98	6	2022-10-26 21:45:21
70	93	10	5	2022-10-20 12:44:05	2022-10-20 19:29:05	230	137	15	2022-10-26 21:45:22
71	73	9	13	2022-10-21 19:44:05	2022-10-22 15:01:05	444	159	72	2022-10-26 21:45:22
72	28	4	2	2022-10-20 13:44:05	2022-10-21 00:41:05	230	393	9	2022-10-26 21:45:22
73	14	2	13	2022-10-22 11:44:05	2022-10-22 16:14:05	283	394	76	2022-10-26 21:45:22
74	78	10	4	2022-10-20 11:44:05	2022-10-21 04:38:05	49	391	8	2022-10-26 21:45:22
75	56	11	9	2022-10-20 04:44:05	2022-10-20 05:25:05	111	167	25	2022-10-26 21:45:22
76	68	1	6	2022-10-23 07:44:05	2022-10-23 11:46:05	213	280	11	2022-10-26 21:45:22
77	47	31	3	2022-10-20 04:44:05	2022-10-20 12:16:05	103	182	23	2022-10-26 21:45:22
78	6	13	8	2022-10-22 04:44:05	2022-10-22 06:26:05	245	73	92	2022-10-26 21:45:22
79	8	13	5	2022-10-20 02:44:05	2022-10-20 12:29:05	487	213	90	2022-10-26 21:45:22
80	7	2	7	2022-10-21 05:44:05	2022-10-22 01:33:05	396	336	93	2022-10-26 21:45:22
81	86	9	13	2022-10-21 17:44:05	2022-10-22 05:20:05	62	27	88	2022-10-26 21:45:22
82	69	3	13	2022-10-20 21:44:05	2022-10-21 05:22:05	282	297	95	2022-10-26 21:45:22
83	62	7	10	2022-10-22 17:12:09	2022-10-23 03:21:09	141	151	11	2022-10-27 01:12:09
84	74	5	4	2022-10-22 15:12:09	2022-10-24 17:27:09	191	15	28	2022-10-27 01:12:09
85	37	2	11	2022-10-21 10:12:09	2022-10-25 00:23:09	0	70	45	2022-10-27 01:12:09
86	20	3	4	2022-10-20 17:12:09	2022-10-21 12:12:09	103	381	30	2022-10-27 01:12:09
87	2	3	9	2022-10-20 08:12:09	2022-10-21 22:57:09	286	169	19	2022-10-27 01:12:09
88	55	1	8	2022-10-20 22:12:09	2022-10-23 01:49:09	290	116	1	2022-10-27 01:12:09
89	20	2	13	2022-10-24 17:12:09	2022-10-25 05:10:09	191	342	27	2022-10-27 01:12:09
90	60	31	13	2022-10-24 10:12:09	2022-10-25 10:59:09	7	336	36	2022-10-27 01:12:09
91	53	4	5	2022-10-20 07:12:09	2022-10-22 11:26:09	405	123	12	2022-10-27 01:12:09
92	66	12	5	2022-10-23 00:12:09	2022-10-24 09:59:09	485	3	39	2022-10-27 01:12:09
93	81	9	1	2022-10-24 02:12:09	2022-10-24 23:33:09	364	373	3	2022-10-27 01:12:09
94	5	13	4	2022-10-21 05:12:09	2022-10-24 02:04:09	0	299	16	2022-10-27 01:12:09
95	4	2	4	2022-10-21 14:12:09	2022-10-22 15:18:09	0	289	41	2022-10-27 01:12:09
96	45	10	8	2022-10-22 07:12:09	2022-10-23 03:27:09	33	73	2	2022-10-27 01:12:09
97	95	8	10	2022-10-20 07:12:09	2022-10-23 22:20:09	289	366	23	2022-10-27 01:12:09
98	41	6	4	2022-10-20 17:12:09	2022-10-21 02:36:09	416	58	10	2022-10-27 01:12:09
99	6	2	7	2022-10-20 17:12:09	2022-10-20 19:42:09	126	174	25	2022-10-27 01:12:09
100	80	13	12	2022-10-23 19:12:09	2022-10-25 19:12:09	128	399	21	2022-10-27 01:12:09
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".reviews (id, description, airline_id, customer_id, score, createat) FROM stdin;
1	Ipsumae praesent massased enim roin aduis iaculi. Nostra ger felisq rutrum musfusce abitur que isse 	3	21	6.5	2022-10-25 15:44:13
2	Naeos porta nislqu nam pretiu duis eratquis justov lacini egetlor. Nuncves turpiset curabitu snam ll	3	10	8.0	2022-10-25 15:44:13
3	Duinulla nullam esent cusut oin que. Lacus faucibus turpis mattis teger teger tristi. Ut teger massa	96	16	9.5	2022-10-25 15:44:13
4	Fermen urnaut ullam sollici magnap lacini faucibus ntum gravida. Eger auguesed malesu ligula nulla n	28	15	4.0	2022-10-25 15:44:13
5	Etsed iquam quamnull leofusce ultric tesque lobortis nuncproi faucibus setiam. Vitaenul porttito mii	93	28	4.5	2022-10-25 15:44:13
6	Purus onec dictumst estmorbi enean lacusp. Utcras vulput ent teger fames loremin lacusnam ipsump. Du	59	75	7.0	2022-10-25 15:44:13
7	Ulum tiam pulvinar diam sociis placerat vehicula mauris. Sodale mstut egestas nullam magna lacusp li	44	65	4.5	2022-10-25 15:44:13
8	Volutp tur lisis dolordo quisut enulla parturi dolorve eleifen. Laciniai roin gravida senectus vehic	33	67	2.5	2022-10-25 15:44:13
9	Quamphas varius sceleris maurisma liberom ger dum lectus arcualiq. Risusm scum lectusn vulput ipsumi	48	7	0.0	2022-10-25 15:44:13
10	Uis loremnul nec abitur nunccras quam tempor necmae sollici bibendu. Ger auris rfusce pharetr ligula	83	76	1.0	2022-10-25 15:44:13
11	Lacusp uscras mauris enimphas mus nullam ullam molestie. Potenti loremnul egetal nas ipsump ipsumves	63	78	0.0	2022-10-25 15:44:13
12	Morbi morbi turpisve euismod erdiet metusqui imperdie tiam rsed tortorp. Rutrum varius urna esent lu	80	37	0.5	2022-10-25 15:44:13
13	Sociis snam imperd eratphas mnulla primis. Enimsus ac tsed feugiatm pretiu ultricie lacinia morbi. E	70	27	4.5	2022-10-25 15:44:13
14	Lorem quamut facili viverr turpisut sapienv neque. Felis nislsed que loremin nas bibendu iam egetal 	18	75	4.0	2022-10-25 15:44:14
15	Abitur elemen conubia enimdon metusdo tempor mauris enean. Tesque rissed eratquis roin aenean sagitt	92	8	1.0	2022-10-25 15:44:14
16	Amus odioin arcu llam consec habitant lectusa. Idnulla dolorma nean aliquet estmorbi elitphas estsus	95	22	5.0	2022-10-25 15:44:14
17	Mattis variusma rrased montes hendrer nec enimsed elementu. Liberofu erdiet posuered uis estmae llam	1	26	5.0	2022-10-25 15:44:14
18	Sapienma metuscra onec facili sociosqu roin sodales. Semmaec ligula ras euismodd lorem sem tiam sque	20	63	2.0	2022-10-25 15:44:14
19	Laut tempor vivamus sduis mattis cras. Posuered quam edonec volutp sce lla varius proin eu. Afusce j	60	40	8.0	2022-10-25 15:44:14
20	Fringi enimsed urna magna faucibu lacus. Mauris vivamus ullamcor orci lus vulput gravida iam eduis. 	58	11	0.0	2022-10-25 15:44:14
21	Mauris quam eratetia ipsumves miin metiam abitur proin luctus hac. Dolorve rfusce eratetia tiam liqu	40	72	1.5	2022-10-25 15:44:14
22	Abitur esque teger tiam faucib nibhnul rhoncus. Imperd facili facili magnapro uada elitphas nislae t	68	58	9.5	2022-10-25 15:44:14
23	Uam leosed ctetur quamut auris turpisve. Lectusin metiam quamnull puruscra sellus hac lacus nuncproi	46	3	6.0	2022-10-25 15:44:14
24	Tate blandit justo mauris consequa cursusve egesta mauris. Consequa sim llam curabitu ulum liberom e	84	30	10.0	2022-10-25 15:44:14
25	Praesent aenean uis egestas massama dapibusc nean quam convall. Hac faucibus naeos oin quamnull nequ	63	59	0.5	2022-10-25 15:44:14
26	Aliquet portado varius disse massama quam. Vehicula conseq turpisn lectuss nec turpiset commodo nunc	91	36	4.5	2022-10-25 15:44:14
27	Llam class dolor elitpr orcivest liberoa justop quisut antenull. Sedinteg lacuse iennam laciniai pot	76	62	3.0	2022-10-25 15:44:14
28	Praesent quamut oin ulum nullap posuere isque enean himena isised. Sed nam pulvinar massased rhoncus	21	27	8.5	2022-10-25 15:44:14
29	Loreme ipsum massan bibendu iennam tate odio. Lisis primis ras liquam ctetur quispr sdonec. Sse diss	63	13	6.0	2022-10-25 15:44:14
30	Llam quis rutrum acum nibhnull ultricie ipsumves lacusp estnulla. Egesta ipsumin semnunc lacusaen sa	81	4	9.0	2022-10-25 15:44:14
31	Viverr culus eratfus nas felisq eclass nisimor aesent temporin. Facili phasel fusce lacus ipsumnam i	6	79	2.0	2022-10-25 15:44:14
32	Convall bibend ipsum ndisse ultricie vitaenul tellus. Rutrumnu viverr enean estnulla leosed modnam m	71	10	8.5	2022-10-25 15:44:14
33	Varius mus tasse auctorpr aliquam condim sapiendo lacusp ger. Quamphas porttito blandit proin sedlor	86	16	6.0	2022-10-25 15:44:14
34	Teger bulum magna quam ibulum onec nisi turpisut. Orem vitaenul necsed sit lum sollici. Sagittis nul	84	67	2.0	2022-10-25 15:44:14
35	Lacusp sapiendo enim pharetra isse vehicula et aenean. Tempusp orper auris nibhcras nostra lus ferme	17	18	5.5	2022-10-25 15:44:14
36	Dictumdu nislnam sociis odio atein fringi himena. Sduis pharetr modnam leocur ris lum. Egestas esque	93	33	3.5	2022-10-25 15:44:14
37	Sque oin phasel quiscras ger metuscra ultrices elemen. Dum asin orcisusp dapibusc ecenas eleifend en	12	9	1.0	2022-10-25 15:44:14
38	Class aptent rutrum sque esque aesent. Unc sce nostra nulla entum iennam placerat primis. Interdum a	19	54	1.0	2022-10-25 15:44:14
39	Morbi llus puruscra orcisusp orci risusm laoreet sse cidunt. Mauris hendre lum neque laoreetc aenean	43	14	9.0	2022-10-25 15:44:14
40	Arcu nulla tempor arcused maurisma curabitu tortor. Facili iquam lus ante commodo tortorp noninte ta	86	3	0.0	2022-10-25 15:44:14
41	Potenti placerat potenti uris ctetur bulum. Ndisse tudin laoreet urnavest esent est sfusce auris qua	29	18	4.5	2022-10-25 15:44:14
42	Eger cidunt quiscras condim ut teger temporin. Convall turpisn odio llus aenean bibendum. Habitant n	3	33	4.5	2022-10-25 15:44:14
43	Facilis parturi sed in onec ipsumves portad oin. Erat ornareve aenean tate ibulum sed ante enas null	41	30	0.0	2022-10-25 15:44:14
44	Malesu lacinia tiam aliquete lum uis miquis necsed. Turpisp nulla leo ultricie purusd iam. Mi quamut	30	59	9.5	2022-10-25 15:44:14
45	Id llam faucibus dictumst magnis elementu metuscra nuncnunc ris. Nuncsed adipis vulput element class	55	24	5.0	2022-10-25 15:44:14
46	Sque pornam estsusp euismodd curabitu lacinia imperd inceptos. Molestie posuered enas bibendu eduis 	14	59	6.0	2022-10-25 15:44:14
47	Tincid velit dapibusc non vulput llam pulvina. Duis rproin loremnul blandi tempor fermen justo egest	96	69	4.0	2022-10-25 15:44:14
48	Donec ssed nuncves cubilia esque platea nulla fermen. Que adipisci unc ger congued uisque curae. Squ	15	16	5.5	2022-10-25 15:44:14
49	Elementu anteduis arcualiq tortor quat nuncves. Tiam antenull magnaqu cursus metiam bulum vehicula o	11	44	2.5	2022-10-25 15:44:14
50	Oin modnam orem proin quamut nec urnavest arcu. Orcivest faucibus eunulla augueph odiophas elit que.	44	13	9.0	2022-10-25 15:44:14
51	Eratfus egesta lum ger egetlor euismodd nulla himena mattisae lectus. Onec varius enim quat lum pulv	20	48	3.0	2022-10-25 15:44:14
52	Maurisin bulum aliquet tate quisque illa cing. Turpisf pharetr ntum eratquis felisut duis nean. Enim	78	32	1.5	2022-10-25 15:44:14
53	Lum ndisse egetlor est ultricie ipsumnam. Placerat dolornu egetal himenaeo mauris lla estmae diamin 	17	27	2.0	2022-10-25 15:44:14
54	Aptent vivamus ipsump iaculis urient commodo volutpat aenean. Diam musfusce ent llam aenean iquam ad	64	19	5.5	2022-10-25 15:44:14
55	Facilisi urnavest nas orciduis tesque snam placerat liquam uisque himena. Erossed pretium mattiss va	59	46	1.0	2022-10-25 15:44:14
56	Nulla pharetr mauris cras ras lacini ellus maurisd convall cubilia. Purus oin dapibusc que uscras gr	7	19	1.0	2022-10-25 15:44:14
57	Felisq congue setiam euismod bibend arcu enim rerit. Ras congue elemen mattisae usce dictumdu. Primi	64	19	2.0	2022-10-25 15:44:14
58	Est lla odio ut morbi oin. Arcucura sollic esent nibhnull ornare bulum. Urnaut risusut ent fusce var	64	34	5.5	2022-10-25 15:44:14
59	Sed sedin ulum adipisci risusm noninte. Tfusce hendrer eratquis viverr natis himena ullamcor. Culus 	17	35	4.0	2022-10-25 15:44:14
60	Arcucura semnunc aenean accumsan nequesed euismod nec. Orbi portad curabitu egesta quam temporin jus	53	72	6.0	2022-10-25 15:44:14
61	Enulla eunulla sedinteg sque nean pornam sellus bulum. Ligulain justov primis quisut nuncnunc sellus	4	79	1.0	2022-10-25 15:44:14
62	Elitpr donec euismodd arcualiq nas liquam eratquis ullam potenti elit. Teger mauris mattiss quisut d	95	31	9.0	2022-10-25 15:44:14
63	Bibendum rrased lum egesta porta modnam orci sociosqu egetal. Lorem ndisse uam euismod sduis convall	96	61	6.5	2022-10-25 15:44:14
64	Lobortis turpisf sit purusd dictumdu suscip venenat nislin musetiam blandi. Ipsumves pharetra sent d	6	31	2.0	2022-10-25 15:44:14
65	Sociis liberos turpisp tempus porta nuncproi quisut sce. Consec varius diamin convall class dictums 	90	15	8.0	2022-10-25 15:44:14
66	Laoreetc oin varius egestas lacusaen fermen sed scum. Enas que rutruma vehicula dignis nulla. Natoqu	20	66	7.5	2022-10-25 15:44:14
67	Necmae daut pretiu libero sse ivamus mauris feugiat sacras turpisp. Tur maurisve liberout est morbi 	58	78	0.0	2022-10-25 15:44:14
68	Nisi sque proin morbi dum lisis nunccras euismo. Necsed mipraese vitaenul lum entum rrased at auris 	67	16	2.5	2022-10-25 15:44:14
69	Teger nisl nec cing tellus ellus teger enean. Ligulam pharetr nisiinte nislsed lum convalli nean arc	60	36	6.0	2022-10-25 15:44:14
70	Elementu que mipraese dumin ultrici temporse pretiu. Ultrices iam erdiet fringi congue nuncsed tur. 	61	22	3.0	2022-10-25 15:44:14
71	Mauris itnunc dumin tortor sfusce nascetur semnunc. Quamin adipis himena pretiu orem class semnunc s	4	38	1.0	2022-10-25 15:44:14
72	Tempor fermen aenean metusdo ent dapibus nean itnunc nibh sduis. Diamin unc lacusp lacuse ntum litor	23	58	5.5	2022-10-25 15:44:14
73	Que ipsumma tate sdonec malesu dapibus laoreet arcucura augueph metuscra. Uisque maurisin condim lao	36	38	4.0	2022-10-25 15:44:51
74	Rerit bibendum esent feugiatn unc ent ecenas. Itor praesent elementu nisl bulum auris class fringi e	18	46	1.0	2022-10-25 15:44:51
75	Sed cidunt lum risus semmaec taciti daut enimlo. Nibhcras egesta laoreet tudin pharetr tesque orci e	25	58	0.5	2022-10-25 15:44:51
76	Elitpr urna porttito molesti musetiam necnunc potenti vehicula. Quam quamal telluset sse rosed sim l	79	29	3.5	2022-10-25 15:44:51
77	Ligulain enim magnapro faucibu litora esque. Hendrer mstut morbi dis aenean montes tdonec elementu b	9	84	5.0	2022-10-25 15:44:51
78	Convalli tate tesque telluss auris et turpis ipsump quam nislsed. Varius laut lobortis porttito urna	75	43	6.5	2022-10-25 15:44:51
79	Lus seminteg duis turpiset daut dignis taciti. Viverra accumsan rerit vehicula interdum nislqu orci 	37	50	1.5	2022-10-25 15:44:51
80	Iquam ante varius fringi tempor netus molesti himena feugiat duis. Tudin rutrumnu vehicula unc metia	44	86	3.0	2022-10-25 15:44:51
81	Class purusd lacusp orper faucibus sduis lacus cusut lus maurisin. Elitpr erat modnam tique varius e	43	25	1.0	2022-10-25 15:44:51
82	Molest sduis snam quam abitur imperd donec uscras. Sapienna aesent pretiu ntum aenean montes dictums	47	100	4.0	2022-10-25 15:44:51
83	Turpisut facilis diam maurisve lacinia himena sed dum pretiu. Oin quisque laoreet fusce amet ulum rr	86	96	6.0	2022-10-25 15:44:51
84	Euismo oin egestas euismodd disse nullam platea. Amet per mus nisimor ulum aenean nibh disse lacusp.	44	68	2.0	2022-10-25 15:44:51
85	Aliquam oin odioin lobortis elemen id uis. Cing quisque nec tetiam blandit itnunc. Potenti dumin pla	4	84	0.5	2022-10-25 15:44:51
86	Iquam gravidas nec molest rissed ac itor rerit lorem. Noninte commodo auris turpisut tempusp morbi t	96	82	4.5	2022-10-25 15:44:51
87	Himena odioin oin cubilia iennam laoreet turpisp eratetia. Massan temporin fringi fusce necinte liqu	90	6	0.5	2022-10-25 15:44:51
88	Ris teger vestibu vehicula nonmorbi nulla. Tellus facilis mi aesent sque oin laoreet lacusp potent. 	81	46	4.0	2022-10-25 15:44:51
89	Ipsumma mauris dolorve metussed accumsan aptent. Magnaqu mollis turpisf sceler onec leo nibhnul temp	48	1	4.0	2022-10-25 15:44:51
90	Ent magnaa uisque aliquam cidunt uisque et nullain abitur orcisusp. Tempus enean setiam dapibus puru	28	66	6.5	2022-10-25 15:44:51
91	Itur arcused tortorp sagittis vehicula blandit. Lla enulla oin ullamcor est cidunt. Iquam aliquet eg	31	88	8.5	2022-10-25 15:44:51
92	Orper teger pharetra viverr isse semmaec nec bulum eratquis quat. Duifusce eratphas nequesed tesque 	100	40	3.0	2022-10-25 15:44:51
93	Tristiq nislae musetiam sociis conseq leopelle pretium viverr augue noninte. Bibendu in uris mauris 	79	45	9.0	2022-10-25 15:44:51
94	Enas quam uis metus eleifen pretiu disse estmorbi. Pellent rfusce auctorcr nulla mauris nislin aliqu	13	60	3.0	2022-10-25 15:44:51
95	Ultricie roin adipisci elemen lectus uamnam sodalesm. Massama ndisse aesent ras nislqu etsed uam abi	7	7	1.0	2022-10-25 15:44:51
96	Elit nequesed ivamus feugiatn leocras arcused fusce asin iam nec. Iam ullam nullam uisque fringi tia	34	22	6.5	2022-10-25 15:44:51
97	Parturi dictum molest atein aliquam sapiendo torquent sagittis aenean mattis. Duis magnaves lisis bu	67	80	2.0	2022-10-25 15:45:14
98	Congue telluss sociis enean uisque risusvi nisl quamal. Sacras imperd risusm natoque netus nean metu	24	82	3.5	2022-10-25 15:45:14
99	Cidunt rissed nullam aesent edonec variusma. Itur lacinia ger dis sapienv nibh mipraese. Elitpr eges	48	26	2.0	2022-10-25 15:45:14
100	Que blandit felisq cursusp faucibus esque. Mauris quisut faucibus congued sodale naeos quisque. Uamn	18	9	9.0	2022-10-25 15:45:14
\.


--
-- Data for Name: ticket_history; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".ticket_history (id, flight_id, customer_id, cost, stripe_id, createdat, original_id) FROM stdin;
35	6	72	98	Data Generator Stripe Id	2022-10-26 21:45:22	1
36	7	11	157	Data Generator Stripe Id	2022-10-26 21:45:22	2
37	87	40	134	Data Generator Stripe Id	2022-10-26 21:45:22	3
38	93	28	336	Data Generator Stripe Id	2022-10-26 21:45:22	4
39	71	9	377	Data Generator Stripe Id	2022-10-26 21:45:22	6
40	93	68	336	Data Generator Stripe Id	2022-10-26 21:45:22	7
41	600	74	377	Data Generator Stripe Id	2022-10-26 21:45:22	10
42	93	77	336	Data Generator Stripe Id	2022-10-26 21:45:22	11
43	62	73	104	Data Generator Stripe Id	2022-10-26 21:45:22	14
44	62	16	104	Data Generator Stripe Id	2022-10-26 21:45:22	18
45	26	55	223	Data Generator Stripe Id	2022-10-26 21:45:22	19
46	64	5	126	Data Generator Stripe Id	2022-10-26 21:45:22	22
47	90	50	213	Data Generator Stripe Id	2022-10-26 21:45:22	26
48	93	96	336	Data Generator Stripe Id	2022-10-26 21:45:22	27
49	600	13	377	Data Generator Stripe Id	2022-10-26 21:45:22	29
50	30	20	44	Data Generator Stripe Id	2022-10-26 21:45:22	30
51	71	24	377	Data Generator Stripe Id	2022-10-26 21:45:22	31
52	70	57	197	Data Generator Stripe Id	2022-10-26 21:45:22	32
53	56	75	387	Data Generator Stripe Id	2022-10-26 21:45:22	33
54	82	98	211	Data Generator Stripe Id	2022-10-26 21:45:22	36
55	55	41	233	Data Generator Stripe Id	2022-10-26 21:45:22	37
56	9	68	393	Data Generator Stripe Id	2022-10-26 21:45:22	39
57	54	85	158	Data Generator Stripe Id	2022-10-26 21:45:22	40
58	54	98	158	Data Generator Stripe Id	2022-10-26 21:45:22	41
59	600	88	377	Data Generator Stripe Id	2022-10-26 21:45:22	42
60	37	61	304	Data Generator Stripe Id	2022-10-26 21:45:22	43
61	1	22	151	Data Generator Stripe Id	2022-10-26 21:45:22	44
62	73	36	77	Data Generator Stripe Id	2022-10-26 21:45:22	45
63	21	97	288	Data Generator Stripe Id	2022-10-26 21:45:22	47
64	80	87	234	Data Generator Stripe Id	2022-10-26 21:45:22	48
65	76	94	394	Data Generator Stripe Id	2022-10-26 21:45:22	53
66	88	56	27	Data Generator Stripe Id	2022-10-26 21:45:22	54
67	19	33	60	Data Generator Stripe Id	2022-10-26 21:45:22	56
68	22	85	383	Data Generator Stripe Id	2022-10-26 21:45:22	59
69	70	68	197	Data Generator Stripe Id	2022-10-26 21:45:22	61
70	58	67	8	Data Generator Stripe Id	2022-10-26 21:45:22	62
71	73	61	77	Data Generator Stripe Id	2022-10-26 21:45:22	64
72	54	75	158	Data Generator Stripe Id	2022-10-26 21:45:22	65
73	82	99	211	Data Generator Stripe Id	2022-10-26 21:45:22	66
74	22	94	383	Data Generator Stripe Id	2022-10-26 21:45:22	67
75	33	31	342	Data Generator Stripe Id	2022-10-26 21:45:22	69
76	8	44	391	Data Generator Stripe Id	2022-10-26 21:45:22	70
77	56	76	387	Data Generator Stripe Id	2022-10-26 21:45:22	74
78	33	8	342	Data Generator Stripe Id	2022-10-26 21:45:22	75
79	87	47	134	Data Generator Stripe Id	2022-10-26 21:45:22	77
80	15	96	137	Data Generator Stripe Id	2022-10-26 21:45:22	79
81	95	58	297	Data Generator Stripe Id	2022-10-26 21:45:22	82
82	39	21	385	Data Generator Stripe Id	2022-10-26 21:45:22	83
83	9	61	393	Data Generator Stripe Id	2022-10-26 21:45:22	84
84	39	92	385	Data Generator Stripe Id	2022-10-26 21:45:22	86
85	72	75	159	Data Generator Stripe Id	2022-10-26 21:45:22	87
86	76	13	394	Data Generator Stripe Id	2022-10-26 21:45:22	89
87	11	99	280	Data Generator Stripe Id	2022-10-26 21:45:22	91
88	25	49	167	Data Generator Stripe Id	2022-10-26 21:45:22	92
89	11	3	280	Data Generator Stripe Id	2022-10-26 21:45:22	93
90	8	76	391	Data Generator Stripe Id	2022-10-26 21:45:22	94
91	6	46	98	Data Generator Stripe Id	2022-10-26 21:45:22	95
92	23	38	182	Data Generator Stripe Id	2022-10-26 21:45:22	98
93	41	88	289	Data Generator Stripe Id	2022-10-27 01:13:15	3
94	16	32	299	Data Generator Stripe Id	2022-10-27 01:13:15	5
95	27	31	342	Data Generator Stripe Id	2022-10-27 01:13:15	10
96	41	39	289	Data Generator Stripe Id	2022-10-27 01:13:15	12
97	2	71	73	Data Generator Stripe Id	2022-10-27 01:13:15	11
98	12	34	123	Data Generator Stripe Id	2022-10-27 01:13:15	13
99	27	95	342	Data Generator Stripe Id	2022-10-27 01:13:15	19
100	16	94	299	Data Generator Stripe Id	2022-10-27 01:13:15	18
101	36	93	336	Data Generator Stripe Id	2022-10-27 01:13:15	22
102	28	86	15	Data Generator Stripe Id	2022-10-27 01:13:16	30
103	3	18	373	Data Generator Stripe Id	2022-10-27 01:13:16	25
104	16	76	299	Data Generator Stripe Id	2022-10-27 01:13:16	31
105	10	43	58	Data Generator Stripe Id	2022-10-27 01:13:17	34
106	10	83	58	Data Generator Stripe Id	2022-10-27 01:13:17	37
107	16	22	299	Data Generator Stripe Id	2022-10-27 01:13:17	40
108	28	24	15	Data Generator Stripe Id	2022-10-27 01:13:17	41
109	3	51	373	Data Generator Stripe Id	2022-10-27 01:13:17	43
110	2	21	73	Data Generator Stripe Id	2022-10-27 01:13:17	49
111	2	23	73	Data Generator Stripe Id	2022-10-27 01:13:17	52
112	41	40	289	Data Generator Stripe Id	2022-10-27 01:13:17	53
113	28	76	15	Data Generator Stripe Id	2022-10-27 01:13:18	56
114	16	23	299	Data Generator Stripe Id	2022-10-27 01:13:18	54
115	2	57	73	Data Generator Stripe Id	2022-10-27 01:13:18	58
116	3	59	373	Data Generator Stripe Id	2022-10-27 01:13:18	59
117	16	48	299	Data Generator Stripe Id	2022-10-27 01:13:18	60
118	27	58	342	Data Generator Stripe Id	2022-10-27 01:13:18	61
119	2	45	73	Data Generator Stripe Id	2022-10-27 01:13:18	62
120	3	53	373	Data Generator Stripe Id	2022-10-27 01:13:18	63
121	12	24	123	Data Generator Stripe Id	2022-10-27 01:13:18	65
122	16	79	299	Data Generator Stripe Id	2022-10-27 01:13:18	70
123	28	74	15	Data Generator Stripe Id	2022-10-27 01:13:18	71
124	10	92	58	Data Generator Stripe Id	2022-10-27 01:13:18	73
125	3	37	373	Data Generator Stripe Id	2022-10-27 01:13:19	86
126	2	35	73	Data Generator Stripe Id	2022-10-27 01:13:19	83
127	27	8	342	Data Generator Stripe Id	2022-10-27 01:13:19	84
128	12	65	123	Data Generator Stripe Id	2022-10-27 01:13:19	88
129	45	25	70	Data Generator Stripe Id	2022-10-27 01:13:19	91
130	12	89	123	Data Generator Stripe Id	2022-10-27 01:13:19	96
131	10	66	58	Data Generator Stripe Id	2022-10-27 01:13:20	119
132	16	25	299	Data Generator Stripe Id	2022-10-27 01:13:21	122
133	10	55	58	Data Generator Stripe Id	2022-10-27 01:13:21	133
134	27	2	342	Data Generator Stripe Id	2022-10-27 01:13:21	141
135	3	51	373	Data Generator Stripe Id	2022-10-27 01:13:21	146
136	2	40	73	Data Generator Stripe Id	2022-10-27 01:13:21	148
137	16	10	299	Data Generator Stripe Id	2022-10-27 01:13:22	155
138	36	98	336	Data Generator Stripe Id	2022-10-27 01:13:22	157
139	28	31	15	Data Generator Stripe Id	2022-10-27 01:13:22	156
140	41	79	289	Data Generator Stripe Id	2022-10-27 01:13:22	159
141	10	28	58	Data Generator Stripe Id	2022-10-27 01:13:22	160
142	3	95	373	Data Generator Stripe Id	2022-10-27 01:13:23	161
143	45	65	70	Data Generator Stripe Id	2022-10-27 01:13:23	163
144	3	90	373	Data Generator Stripe Id	2022-10-27 01:13:23	168
145	27	66	342	Data Generator Stripe Id	2022-10-27 01:13:23	167
146	10	19	58	Data Generator Stripe Id	2022-10-27 01:13:23	172
147	41	4	289	Data Generator Stripe Id	2022-10-27 01:13:23	179
148	12	1	123	Data Generator Stripe Id	2022-10-27 01:13:24	191
149	3	15	373	Data Generator Stripe Id	2022-10-27 01:13:25	209
150	3	68	373	Data Generator Stripe Id	2022-10-27 01:13:25	219
151	45	87	70	Data Generator Stripe Id	2022-10-27 01:13:25	223
152	2	42	73	Data Generator Stripe Id	2022-10-27 01:13:25	231
153	16	41	299	Data Generator Stripe Id	2022-10-27 01:13:26	244
154	28	86	15	Data Generator Stripe Id	2022-10-27 01:13:26	250
155	36	56	336	Data Generator Stripe Id	2022-10-27 01:13:26	253
156	12	18	123	Data Generator Stripe Id	2022-10-27 01:13:26	251
157	16	23	299	Data Generator Stripe Id	2022-10-27 01:13:27	260
158	3	99	373	Data Generator Stripe Id	2022-10-27 01:13:27	263
159	28	34	15	Data Generator Stripe Id	2022-10-27 01:13:27	267
160	36	78	336	Data Generator Stripe Id	2022-10-27 01:13:19	90
161	16	41	299	Data Generator Stripe Id	2022-10-27 01:13:19	94
162	28	31	15	Data Generator Stripe Id	2022-10-27 01:13:20	101
163	27	40	342	Data Generator Stripe Id	2022-10-27 01:13:20	100
164	36	24	336	Data Generator Stripe Id	2022-10-27 01:13:20	105
165	12	19	123	Data Generator Stripe Id	2022-10-27 01:13:20	108
166	2	79	73	Data Generator Stripe Id	2022-10-27 01:13:20	110
167	45	71	70	Data Generator Stripe Id	2022-10-27 01:13:20	111
168	10	82	58	Data Generator Stripe Id	2022-10-27 01:13:20	113
169	27	60	342	Data Generator Stripe Id	2022-10-27 01:13:20	114
170	41	56	289	Data Generator Stripe Id	2022-10-27 01:13:21	124
171	27	63	342	Data Generator Stripe Id	2022-10-27 01:13:21	127
172	3	66	373	Data Generator Stripe Id	2022-10-27 01:13:21	131
173	41	39	289	Data Generator Stripe Id	2022-10-27 01:13:21	140
174	27	54	342	Data Generator Stripe Id	2022-10-27 01:13:21	145
175	27	59	342	Data Generator Stripe Id	2022-10-27 01:13:22	153
176	28	41	15	Data Generator Stripe Id	2022-10-27 01:13:23	165
177	41	89	289	Data Generator Stripe Id	2022-10-27 01:13:23	164
178	3	74	373	Data Generator Stripe Id	2022-10-27 01:13:23	169
179	12	91	123	Data Generator Stripe Id	2022-10-27 01:13:23	171
180	12	32	123	Data Generator Stripe Id	2022-10-27 01:13:23	180
181	28	9	15	Data Generator Stripe Id	2022-10-27 01:13:23	188
182	41	24	289	Data Generator Stripe Id	2022-10-27 01:13:24	195
183	45	3	70	Data Generator Stripe Id	2022-10-27 01:13:25	208
184	28	53	15	Data Generator Stripe Id	2022-10-27 01:13:25	213
185	10	91	58	Data Generator Stripe Id	2022-10-27 01:13:25	225
186	36	68	336	Data Generator Stripe Id	2022-10-27 01:13:25	232
187	10	74	58	Data Generator Stripe Id	2022-10-27 01:13:25	235
188	28	59	15	Data Generator Stripe Id	2022-10-27 01:13:26	238
189	12	7	123	Data Generator Stripe Id	2022-10-27 01:13:26	243
190	10	45	58	Data Generator Stripe Id	2022-10-27 01:13:26	245
191	10	48	58	Data Generator Stripe Id	2022-10-27 01:13:26	248
192	2	86	73	Data Generator Stripe Id	2022-10-27 01:13:26	249
193	16	88	299	Data Generator Stripe Id	2022-10-27 01:13:26	256
194	45	82	70	Data Generator Stripe Id	2022-10-27 01:13:26	258
195	27	96	342	Data Generator Stripe Id	2022-10-27 01:13:27	259
196	2	76	73	Data Generator Stripe Id	2022-10-27 01:13:27	262
197	16	95	299	Data Generator Stripe Id	2022-10-27 01:13:27	269
198	45	73	70	Data Generator Stripe Id	2022-10-27 01:13:27	273
199	28	68	15	Data Generator Stripe Id	2022-10-27 01:13:27	275
200	16	8	299	Data Generator Stripe Id	2022-10-27 01:13:28	277
201	36	69	336	Data Generator Stripe Id	2022-10-27 01:13:28	280
202	12	86	123	Data Generator Stripe Id	2022-10-27 01:13:28	288
203	3	33	373	Data Generator Stripe Id	2022-10-27 01:13:28	305
204	3	42	373	Data Generator Stripe Id	2022-10-27 01:13:29	310
205	3	70	373	Data Generator Stripe Id	2022-10-27 01:13:30	315
206	41	71	289	Data Generator Stripe Id	2022-10-27 01:13:30	320
207	36	15	336	Data Generator Stripe Id	2022-10-27 01:13:30	334
208	10	4	58	Data Generator Stripe Id	2022-10-27 01:13:31	336
209	3	19	373	Data Generator Stripe Id	2022-10-27 01:13:31	347
210	3	63	373	Data Generator Stripe Id	2022-10-27 01:13:31	349
211	2	58	73	Data Generator Stripe Id	2022-10-27 01:13:31	357
212	2	44	73	Data Generator Stripe Id	2022-10-27 01:13:32	372
213	28	95	15	Data Generator Stripe Id	2022-10-27 01:13:32	375
214	10	79	58	Data Generator Stripe Id	2022-10-27 01:13:32	374
215	2	78	73	Data Generator Stripe Id	2022-10-27 01:13:33	387
216	2	78	73	Data Generator Stripe Id	2022-10-27 01:13:44	398
217	28	43	15	Data Generator Stripe Id	2022-10-27 01:13:44	402
218	36	1	336	Data Generator Stripe Id	2022-10-27 01:13:44	404
219	3	61	373	Data Generator Stripe Id	2022-10-27 01:13:45	415
220	41	27	289	Data Generator Stripe Id	2022-10-27 01:13:45	420
221	10	10	58	Data Generator Stripe Id	2022-10-27 01:13:46	429
222	3	40	373	Data Generator Stripe Id	2022-10-27 01:13:46	428
223	3	28	373	Data Generator Stripe Id	2022-10-27 01:13:27	271
224	28	60	15	Data Generator Stripe Id	2022-10-27 01:13:28	284
225	10	21	58	Data Generator Stripe Id	2022-10-27 01:13:28	289
226	3	57	373	Data Generator Stripe Id	2022-10-27 01:13:28	299
227	36	23	336	Data Generator Stripe Id	2022-10-27 01:13:28	304
228	16	1	299	Data Generator Stripe Id	2022-10-27 01:13:29	308
229	16	45	299	Data Generator Stripe Id	2022-10-27 01:13:29	313
230	36	73	336	Data Generator Stripe Id	2022-10-27 01:13:30	319
231	16	95	299	Data Generator Stripe Id	2022-10-27 01:13:30	325
232	16	34	299	Data Generator Stripe Id	2022-10-27 01:13:30	329
233	41	99	289	Data Generator Stripe Id	2022-10-27 01:13:31	340
234	41	84	289	Data Generator Stripe Id	2022-10-27 01:13:31	346
235	16	24	299	Data Generator Stripe Id	2022-10-27 01:13:31	351
236	41	96	289	Data Generator Stripe Id	2022-10-27 01:13:31	355
237	2	3	73	Data Generator Stripe Id	2022-10-27 01:13:31	361
238	16	92	299	Data Generator Stripe Id	2022-10-27 01:13:31	363
239	41	14	289	Data Generator Stripe Id	2022-10-27 01:13:31	371
240	3	85	373	Data Generator Stripe Id	2022-10-27 01:13:44	393
241	3	96	373	Data Generator Stripe Id	2022-10-27 01:13:44	400
242	28	45	15	Data Generator Stripe Id	2022-10-27 01:13:44	408
243	41	21	289	Data Generator Stripe Id	2022-10-27 01:13:45	411
244	36	81	336	Data Generator Stripe Id	2022-10-27 01:13:46	440
245	10	6	58	Data Generator Stripe Id	2022-10-27 01:13:46	439
246	10	19	58	Data Generator Stripe Id	2022-10-27 01:13:46	442
247	41	54	289	Data Generator Stripe Id	2022-10-27 01:13:46	444
248	41	30	289	Data Generator Stripe Id	2022-10-27 01:13:47	448
249	12	60	123	Data Generator Stripe Id	2022-10-27 01:13:47	452
250	12	93	123	Data Generator Stripe Id	2022-10-27 01:13:48	462
251	10	96	58	Data Generator Stripe Id	2022-10-27 01:13:48	467
252	41	5	289	Data Generator Stripe Id	2022-10-27 01:13:48	472
253	10	74	58	Data Generator Stripe Id	2022-10-27 01:13:48	481
254	28	65	15	Data Generator Stripe Id	2022-10-27 01:13:49	486
255	28	41	15	Data Generator Stripe Id	2022-10-27 01:13:49	497
256	27	31	342	Data Generator Stripe Id	2022-10-27 01:13:49	505
257	3	53	373	Data Generator Stripe Id	2022-10-27 01:13:49	512
258	36	13	336	Data Generator Stripe Id	2022-10-27 01:13:49	514
259	2	36	73	Data Generator Stripe Id	2022-10-27 01:13:49	515
260	27	23	342	Data Generator Stripe Id	2022-10-27 01:13:49	517
261	12	72	123	Data Generator Stripe Id	2022-10-27 01:13:50	523
262	41	77	289	Data Generator Stripe Id	2022-10-27 01:13:51	557
263	28	96	15	Data Generator Stripe Id	2022-10-27 01:13:51	558
264	3	29	373	Data Generator Stripe Id	2022-10-27 01:13:52	565
265	28	10	15	Data Generator Stripe Id	2022-10-27 01:13:59	568
266	12	82	123	Data Generator Stripe Id	2022-10-27 01:13:59	570
267	12	51	123	Data Generator Stripe Id	2022-10-27 01:14:00	576
268	41	20	289	Data Generator Stripe Id	2022-10-27 01:14:00	580
269	10	81	58	Data Generator Stripe Id	2022-10-27 01:14:01	588
270	36	76	336	Data Generator Stripe Id	2022-10-27 01:14:01	586
271	2	4	73	Data Generator Stripe Id	2022-10-27 01:14:01	592
272	41	63	289	Data Generator Stripe Id	2022-10-27 01:14:01	595
273	12	8	123	Data Generator Stripe Id	2022-10-27 01:14:02	606
274	10	4	58	Data Generator Stripe Id	2022-10-27 01:14:02	608
275	27	19	342	Data Generator Stripe Id	2022-10-27 01:13:47	450
276	27	79	342	Data Generator Stripe Id	2022-10-27 01:13:47	453
277	28	37	15	Data Generator Stripe Id	2022-10-27 01:13:47	455
278	28	16	15	Data Generator Stripe Id	2022-10-27 01:13:47	458
279	10	5	58	Data Generator Stripe Id	2022-10-27 01:13:48	463
280	27	92	342	Data Generator Stripe Id	2022-10-27 01:13:48	473
281	27	98	342	Data Generator Stripe Id	2022-10-27 01:13:48	477
282	3	70	373	Data Generator Stripe Id	2022-10-27 01:13:48	485
283	10	15	58	Data Generator Stripe Id	2022-10-27 01:13:49	491
284	28	77	15	Data Generator Stripe Id	2022-10-27 01:13:49	498
285	41	65	289	Data Generator Stripe Id	2022-10-27 01:13:49	499
286	10	17	58	Data Generator Stripe Id	2022-10-27 01:13:49	504
287	2	51	73	Data Generator Stripe Id	2022-10-27 01:13:49	506
288	3	77	373	Data Generator Stripe Id	2022-10-27 01:13:49	509
289	27	39	342	Data Generator Stripe Id	2022-10-27 01:13:50	520
290	41	34	289	Data Generator Stripe Id	2022-10-27 01:13:50	535
291	3	39	373	Data Generator Stripe Id	2022-10-27 01:13:51	547
292	27	45	342	Data Generator Stripe Id	2022-10-27 01:13:51	550
293	36	76	336	Data Generator Stripe Id	2022-10-27 01:13:51	551
294	28	6	15	Data Generator Stripe Id	2022-10-27 01:13:52	566
295	36	45	336	Data Generator Stripe Id	2022-10-27 01:14:01	591
296	28	76	15	Data Generator Stripe Id	2022-10-27 01:14:01	593
297	2	88	73	Data Generator Stripe Id	2022-10-27 01:14:02	607
298	27	5	342	Data Generator Stripe Id	2022-10-27 01:14:02	609
299	2	1	73	Data Generator Stripe Id	2022-10-27 01:14:02	610
300	41	6	289	Data Generator Stripe Id	2022-10-27 01:14:02	614
301	28	27	15	Data Generator Stripe Id	2022-10-27 01:14:02	620
302	41	1	289	Data Generator Stripe Id	2022-10-27 01:14:03	625
303	12	51	123	Data Generator Stripe Id	2022-10-27 01:14:03	626
304	36	88	336	Data Generator Stripe Id	2022-10-27 01:14:03	627
305	41	71	289	Data Generator Stripe Id	2022-10-27 01:14:08	636
306	2	45	73	Data Generator Stripe Id	2022-10-27 01:14:08	643
307	36	59	336	Data Generator Stripe Id	2022-10-27 01:14:08	639
308	2	11	73	Data Generator Stripe Id	2022-10-27 01:14:08	644
309	27	52	342	Data Generator Stripe Id	2022-10-27 01:14:09	648
310	2	6	73	Data Generator Stripe Id	2022-10-27 01:14:09	659
311	3	77	373	Data Generator Stripe Id	2022-10-27 01:14:09	662
312	10	50	58	Data Generator Stripe Id	2022-10-27 01:20:19	1183
313	12	4	123	Data Generator Stripe Id	2022-10-27 01:14:03	623
314	36	70	336	Data Generator Stripe Id	2022-10-27 01:14:03	631
315	28	26	15	Data Generator Stripe Id	2022-10-27 01:14:08	642
316	36	25	336	Data Generator Stripe Id	2022-10-27 01:14:09	651
317	36	66	336	Data Generator Stripe Id	2022-10-27 01:14:09	655
318	41	10	289	Data Generator Stripe Id	2022-10-27 01:14:09	658
319	10	25	58	Data Generator Stripe Id	2022-10-27 01:14:09	660
320	27	50	342	Data Generator Stripe Id	2022-10-27 01:14:10	664
321	10	4	58	Data Generator Stripe Id	2022-10-27 01:16:10	673
322	28	80	15	Data Generator Stripe Id	2022-10-27 01:16:11	677
323	2	61	73	Data Generator Stripe Id	2022-10-27 01:16:11	679
324	36	32	336	Data Generator Stripe Id	2022-10-27 01:16:11	682
325	28	50	15	Data Generator Stripe Id	2022-10-27 01:16:11	681
326	12	93	123	Data Generator Stripe Id	2022-10-27 01:19:58	690
327	2	39	73	Data Generator Stripe Id	2022-10-27 01:19:59	692
328	27	9	342	Data Generator Stripe Id	2022-10-27 01:19:59	695
329	36	23	336	Data Generator Stripe Id	2022-10-27 01:19:59	697
330	27	18	342	Data Generator Stripe Id	2022-10-27 01:19:59	698
331	41	3	289	Data Generator Stripe Id	2022-10-27 01:19:59	703
332	3	84	373	Data Generator Stripe Id	2022-10-27 01:19:59	705
333	30	39	381	Data Generator Stripe Id	2022-10-27 01:19:59	710
334	25	29	174	Data Generator Stripe Id	2022-10-27 01:19:59	711
335	2	88	73	Data Generator Stripe Id	2022-10-27 01:19:59	712
336	39	63	3	Data Generator Stripe Id	2022-10-27 01:19:59	713
337	3	49	373	Data Generator Stripe Id	2022-10-27 01:19:59	714
338	39	59	3	Data Generator Stripe Id	2022-10-27 01:19:59	715
339	25	85	174	Data Generator Stripe Id	2022-10-27 01:19:59	717
340	39	45	3	Data Generator Stripe Id	2022-10-27 01:19:59	719
341	30	5	381	Data Generator Stripe Id	2022-10-27 01:19:59	728
342	12	97	123	Data Generator Stripe Id	2022-10-27 01:19:59	729
343	39	42	3	Data Generator Stripe Id	2022-10-27 01:19:59	730
344	21	7	399	Data Generator Stripe Id	2022-10-27 01:19:59	733
345	11	98	151	Data Generator Stripe Id	2022-10-27 01:19:59	743
346	11	31	151	Data Generator Stripe Id	2022-10-27 01:19:59	750
347	23	61	366	Data Generator Stripe Id	2022-10-27 01:19:59	753
348	12	86	123	Data Generator Stripe Id	2022-10-27 01:19:59	754
349	28	40	15	Data Generator Stripe Id	2022-10-27 01:19:59	756
350	21	68	399	Data Generator Stripe Id	2022-10-27 01:19:59	758
351	25	99	174	Data Generator Stripe Id	2022-10-27 01:19:59	759
352	19	51	169	Data Generator Stripe Id	2022-10-27 01:19:59	760
353	12	79	123	Data Generator Stripe Id	2022-10-27 01:19:59	762
354	27	64	342	Data Generator Stripe Id	2022-10-27 01:19:59	763
355	30	8	381	Data Generator Stripe Id	2022-10-27 01:19:59	770
356	28	96	15	Data Generator Stripe Id	2022-10-27 01:19:59	774
357	1	75	116	Data Generator Stripe Id	2022-10-27 01:19:59	779
358	1	92	116	Data Generator Stripe Id	2022-10-27 01:19:59	780
359	36	49	336	Data Generator Stripe Id	2022-10-27 01:19:59	784
360	23	10	366	Data Generator Stripe Id	2022-10-27 01:19:59	787
361	10	13	58	Data Generator Stripe Id	2022-10-27 01:19:59	793
362	19	80	169	Data Generator Stripe Id	2022-10-27 01:19:59	798
363	30	16	381	Data Generator Stripe Id	2022-10-27 01:20:00	799
364	36	35	336	Data Generator Stripe Id	2022-10-27 01:20:00	802
365	30	48	381	Data Generator Stripe Id	2022-10-27 01:20:00	804
366	39	2	3	Data Generator Stripe Id	2022-10-27 01:20:00	806
367	30	92	381	Data Generator Stripe Id	2022-10-27 01:20:00	807
368	25	16	174	Data Generator Stripe Id	2022-10-27 01:20:00	809
369	23	26	366	Data Generator Stripe Id	2022-10-27 01:20:00	811
370	12	35	123	Data Generator Stripe Id	2022-10-27 01:20:00	812
371	3	95	373	Data Generator Stripe Id	2022-10-27 01:20:00	814
372	27	15	342	Data Generator Stripe Id	2022-10-27 01:20:00	816
373	10	60	58	Data Generator Stripe Id	2022-10-27 01:20:00	819
374	1	25	116	Data Generator Stripe Id	2022-10-27 01:20:00	828
375	23	4	366	Data Generator Stripe Id	2022-10-27 01:20:00	830
376	2	19	73	Data Generator Stripe Id	2022-10-27 01:20:00	832
377	2	97	73	Data Generator Stripe Id	2022-10-27 01:20:00	843
378	28	29	15	Data Generator Stripe Id	2022-10-27 01:20:00	846
379	30	52	381	Data Generator Stripe Id	2022-10-27 01:20:00	849
380	21	29	399	Data Generator Stripe Id	2022-10-27 01:20:00	851
381	39	76	3	Data Generator Stripe Id	2022-10-27 01:20:00	853
382	36	6	336	Data Generator Stripe Id	2022-10-27 01:20:00	857
383	39	88	3	Data Generator Stripe Id	2022-10-27 01:20:00	862
384	10	17	58	Data Generator Stripe Id	2022-10-27 01:20:00	866
385	3	64	373	Data Generator Stripe Id	2022-10-27 01:20:00	871
386	3	8	373	Data Generator Stripe Id	2022-10-27 01:20:00	872
387	36	55	336	Data Generator Stripe Id	2022-10-27 01:20:00	873
388	36	68	336	Data Generator Stripe Id	2022-10-27 01:20:00	876
389	10	74	58	Data Generator Stripe Id	2022-10-27 01:20:00	879
390	19	65	169	Data Generator Stripe Id	2022-10-27 01:20:00	880
391	10	15	58	Data Generator Stripe Id	2022-10-27 01:20:00	881
392	36	11	336	Data Generator Stripe Id	2022-10-27 01:20:00	883
393	41	10	289	Data Generator Stripe Id	2022-10-27 01:20:00	884
394	21	12	399	Data Generator Stripe Id	2022-10-27 01:20:00	885
395	25	64	174	Data Generator Stripe Id	2022-10-27 01:20:00	888
396	2	96	73	Data Generator Stripe Id	2022-10-27 01:20:00	892
397	39	92	3	Data Generator Stripe Id	2022-10-27 01:20:00	895
398	28	92	15	Data Generator Stripe Id	2022-10-27 01:20:00	897
399	1	19	116	Data Generator Stripe Id	2022-10-27 01:20:00	898
400	21	46	399	Data Generator Stripe Id	2022-10-27 01:20:00	899
401	27	80	342	Data Generator Stripe Id	2022-10-27 01:20:01	901
402	2	35	73	Data Generator Stripe Id	2022-10-27 01:20:01	903
403	30	63	381	Data Generator Stripe Id	2022-10-27 01:20:01	910
404	19	97	169	Data Generator Stripe Id	2022-10-27 01:20:01	913
405	10	81	58	Data Generator Stripe Id	2022-10-27 01:20:01	914
406	25	50	174	Data Generator Stripe Id	2022-10-27 01:20:01	919
407	2	55	73	Data Generator Stripe Id	2022-10-27 01:20:01	920
408	10	54	58	Data Generator Stripe Id	2022-10-27 01:20:01	921
409	3	95	373	Data Generator Stripe Id	2022-10-27 01:20:01	924
410	10	49	58	Data Generator Stripe Id	2022-10-27 01:20:01	925
411	36	23	336	Data Generator Stripe Id	2022-10-27 01:20:01	926
412	21	21	399	Data Generator Stripe Id	2022-10-27 01:20:01	927
413	21	1	399	Data Generator Stripe Id	2022-10-27 01:20:01	931
414	3	23	373	Data Generator Stripe Id	2022-10-27 01:20:01	932
415	30	40	381	Data Generator Stripe Id	2022-10-27 01:20:01	934
416	1	54	116	Data Generator Stripe Id	2022-10-27 01:20:01	936
417	21	81	399	Data Generator Stripe Id	2022-10-27 01:20:01	942
418	30	89	381	Data Generator Stripe Id	2022-10-27 01:20:01	944
419	2	83	73	Data Generator Stripe Id	2022-10-27 01:20:01	948
420	23	92	366	Data Generator Stripe Id	2022-10-27 01:20:01	949
421	25	5	174	Data Generator Stripe Id	2022-10-27 01:20:01	954
422	19	99	169	Data Generator Stripe Id	2022-10-27 01:20:01	958
423	27	44	342	Data Generator Stripe Id	2022-10-27 01:20:01	965
424	11	64	151	Data Generator Stripe Id	2022-10-27 01:20:01	966
425	2	54	73	Data Generator Stripe Id	2022-10-27 01:20:01	967
426	25	74	174	Data Generator Stripe Id	2022-10-27 01:20:01	971
427	10	24	58	Data Generator Stripe Id	2022-10-27 01:20:01	973
428	1	71	116	Data Generator Stripe Id	2022-10-27 01:20:01	974
429	12	57	123	Data Generator Stripe Id	2022-10-27 01:20:01	975
430	39	92	3	Data Generator Stripe Id	2022-10-27 01:20:01	976
431	2	58	73	Data Generator Stripe Id	2022-10-27 01:20:01	977
432	21	35	399	Data Generator Stripe Id	2022-10-27 01:20:01	981
433	2	79	73	Data Generator Stripe Id	2022-10-27 01:20:01	984
434	23	56	366	Data Generator Stripe Id	2022-10-27 01:20:01	986
435	39	79	3	Data Generator Stripe Id	2022-10-27 01:20:01	988
436	30	78	381	Data Generator Stripe Id	2022-10-27 01:20:01	989
437	19	74	169	Data Generator Stripe Id	2022-10-27 01:20:01	991
438	36	69	336	Data Generator Stripe Id	2022-10-27 01:20:01	995
439	25	41	174	Data Generator Stripe Id	2022-10-27 01:20:01	996
440	28	26	15	Data Generator Stripe Id	2022-10-27 01:20:02	1000
441	11	42	151	Data Generator Stripe Id	2022-10-27 01:20:02	1001
442	19	81	169	Data Generator Stripe Id	2022-10-27 01:20:02	1002
443	19	3	169	Data Generator Stripe Id	2022-10-27 01:20:02	1006
444	21	7	399	Data Generator Stripe Id	2022-10-27 01:20:02	1010
445	23	31	366	Data Generator Stripe Id	2022-10-27 01:20:02	1011
446	23	68	366	Data Generator Stripe Id	2022-10-27 01:20:02	1015
447	3	61	373	Data Generator Stripe Id	2022-10-27 01:20:02	1018
448	3	93	373	Data Generator Stripe Id	2022-10-27 01:20:02	1019
449	30	47	381	Data Generator Stripe Id	2022-10-27 01:20:02	1020
450	12	53	123	Data Generator Stripe Id	2022-10-27 01:20:02	1021
451	27	90	342	Data Generator Stripe Id	2022-10-27 01:20:02	1022
452	28	62	15	Data Generator Stripe Id	2022-10-27 01:20:02	1028
453	39	25	3	Data Generator Stripe Id	2022-10-27 01:20:02	1030
454	2	74	73	Data Generator Stripe Id	2022-10-27 01:20:02	1045
455	25	11	174	Data Generator Stripe Id	2022-10-27 01:20:02	1046
456	27	49	342	Data Generator Stripe Id	2022-10-27 01:20:02	1049
457	30	13	381	Data Generator Stripe Id	2022-10-27 01:20:02	1050
458	28	49	15	Data Generator Stripe Id	2022-10-27 01:20:02	1052
459	27	86	342	Data Generator Stripe Id	2022-10-27 01:20:02	1055
460	21	14	399	Data Generator Stripe Id	2022-10-27 01:20:02	1058
461	1	98	116	Data Generator Stripe Id	2022-10-27 01:20:02	1065
462	19	81	169	Data Generator Stripe Id	2022-10-27 01:20:02	1067
463	21	5	399	Data Generator Stripe Id	2022-10-27 01:20:02	1069
464	2	26	73	Data Generator Stripe Id	2022-10-27 01:20:02	1070
465	11	16	151	Data Generator Stripe Id	2022-10-27 01:20:03	1071
466	11	65	151	Data Generator Stripe Id	2022-10-27 01:20:03	1072
467	3	55	373	Data Generator Stripe Id	2022-10-27 01:20:03	1074
468	28	16	15	Data Generator Stripe Id	2022-10-27 01:20:03	1075
469	36	52	336	Data Generator Stripe Id	2022-10-27 01:20:03	1080
470	36	5	336	Data Generator Stripe Id	2022-10-27 01:20:03	1081
471	12	95	123	Data Generator Stripe Id	2022-10-27 01:20:03	1083
472	10	21	58	Data Generator Stripe Id	2022-10-27 01:20:03	1086
473	3	14	373	Data Generator Stripe Id	2022-10-27 01:20:03	1088
474	27	12	342	Data Generator Stripe Id	2022-10-27 01:20:03	1096
475	30	84	381	Data Generator Stripe Id	2022-10-27 01:20:03	1097
476	1	83	116	Data Generator Stripe Id	2022-10-27 01:20:03	1099
477	3	30	373	Data Generator Stripe Id	2022-10-27 01:20:03	1106
478	2	27	73	Data Generator Stripe Id	2022-10-27 01:20:03	1107
479	12	29	123	Data Generator Stripe Id	2022-10-27 01:20:03	1108
480	28	64	15	Data Generator Stripe Id	2022-10-27 01:20:03	1109
481	28	86	15	Data Generator Stripe Id	2022-10-27 01:20:03	1110
482	21	74	399	Data Generator Stripe Id	2022-10-27 01:20:03	1114
483	28	9	15	Data Generator Stripe Id	2022-10-27 01:20:03	1116
484	1	95	116	Data Generator Stripe Id	2022-10-27 01:20:03	1122
485	36	38	336	Data Generator Stripe Id	2022-10-27 01:20:03	1123
486	10	65	58	Data Generator Stripe Id	2022-10-27 01:20:03	1124
487	39	28	3	Data Generator Stripe Id	2022-10-27 01:20:03	1131
488	25	34	174	Data Generator Stripe Id	2022-10-27 01:20:03	1133
489	30	1	381	Data Generator Stripe Id	2022-10-27 01:20:03	1135
490	23	39	366	Data Generator Stripe Id	2022-10-27 01:20:03	1138
491	11	71	151	Data Generator Stripe Id	2022-10-27 01:20:03	1139
492	10	3	58	Data Generator Stripe Id	2022-10-27 01:20:03	1141
493	39	32	3	Data Generator Stripe Id	2022-10-27 01:20:03	1142
494	12	84	123	Data Generator Stripe Id	2022-10-27 01:20:09	1151
495	39	27	3	Data Generator Stripe Id	2022-10-27 01:20:09	1152
496	23	89	366	Data Generator Stripe Id	2022-10-27 01:20:10	1153
497	21	14	399	Data Generator Stripe Id	2022-10-27 01:20:10	1161
498	10	57	58	Data Generator Stripe Id	2022-10-27 01:20:10	1162
499	11	37	151	Data Generator Stripe Id	2022-10-27 01:20:10	1164
500	30	76	381	Data Generator Stripe Id	2022-10-27 01:20:10	1172
501	30	30	381	Data Generator Stripe Id	2022-10-27 01:20:10	1177
502	36	96	336	Data Generator Stripe Id	2022-10-27 01:20:10	1179
503	3	71	373	Data Generator Stripe Id	2022-10-27 01:20:10	1180
504	2	59	73	Data Generator Stripe Id	2022-10-27 01:20:10	1181
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".tickets (id, flight_id, customer_id, cost, stripe_id, createdat) FROM stdin;
4	20	55	200	Data Generator Stripe Id	2022-10-27 01:13:15
1	40	74	178	Data Generator Stripe Id	2022-10-27 01:13:15
2	17	4	89	Data Generator Stripe Id	2022-10-27 01:13:15
7	5	26	271	Data Generator Stripe Id	2022-10-27 01:13:15
6	24	2	393	Data Generator Stripe Id	2022-10-27 01:13:15
8	43	68	281	Data Generator Stripe Id	2022-10-27 01:13:15
9	24	26	393	Data Generator Stripe Id	2022-10-27 01:13:15
14	20	66	200	Data Generator Stripe Id	2022-10-27 01:13:15
15	44	94	366	Data Generator Stripe Id	2022-10-27 01:13:15
16	4	85	220	Data Generator Stripe Id	2022-10-27 01:13:15
17	49	92	98	Data Generator Stripe Id	2022-10-27 01:13:15
20	38	6	375	Data Generator Stripe Id	2022-10-27 01:13:15
21	49	39	98	Data Generator Stripe Id	2022-10-27 01:13:15
23	35	77	259	Data Generator Stripe Id	2022-10-27 01:13:15
24	32	23	191	Data Generator Stripe Id	2022-10-27 01:13:16
26	17	12	89	Data Generator Stripe Id	2022-10-27 01:13:16
27	44	12	366	Data Generator Stripe Id	2022-10-27 01:13:16
28	17	68	89	Data Generator Stripe Id	2022-10-27 01:13:16
29	32	27	191	Data Generator Stripe Id	2022-10-27 01:13:16
33	13	25	136	Data Generator Stripe Id	2022-10-27 01:13:16
32	20	99	200	Data Generator Stripe Id	2022-10-27 01:13:17
35	24	62	393	Data Generator Stripe Id	2022-10-27 01:13:17
36	38	62	375	Data Generator Stripe Id	2022-10-27 01:13:17
38	5	18	271	Data Generator Stripe Id	2022-10-27 01:13:17
42	32	93	191	Data Generator Stripe Id	2022-10-27 01:13:17
39	13	69	136	Data Generator Stripe Id	2022-10-27 01:13:17
46	47	90	235	Data Generator Stripe Id	2022-10-27 01:13:17
44	43	49	281	Data Generator Stripe Id	2022-10-27 01:13:17
45	43	60	281	Data Generator Stripe Id	2022-10-27 01:13:17
47	43	14	281	Data Generator Stripe Id	2022-10-27 01:13:17
48	38	94	375	Data Generator Stripe Id	2022-10-27 01:13:17
50	24	8	393	Data Generator Stripe Id	2022-10-27 01:13:17
51	44	5	366	Data Generator Stripe Id	2022-10-27 01:13:17
55	32	10	191	Data Generator Stripe Id	2022-10-27 01:13:18
57	18	64	376	Data Generator Stripe Id	2022-10-27 01:13:18
64	43	43	281	Data Generator Stripe Id	2022-10-27 01:13:18
67	17	46	89	Data Generator Stripe Id	2022-10-27 01:13:18
66	47	75	235	Data Generator Stripe Id	2022-10-27 01:13:18
69	13	52	136	Data Generator Stripe Id	2022-10-27 01:13:18
68	18	58	376	Data Generator Stripe Id	2022-10-27 01:13:18
72	13	33	136	Data Generator Stripe Id	2022-10-27 01:13:18
74	13	40	136	Data Generator Stripe Id	2022-10-27 01:13:18
77	38	41	375	Data Generator Stripe Id	2022-10-27 01:13:18
75	32	25	191	Data Generator Stripe Id	2022-10-27 01:13:18
76	43	29	281	Data Generator Stripe Id	2022-10-27 01:13:18
80	43	65	281	Data Generator Stripe Id	2022-10-27 01:13:18
78	32	3	191	Data Generator Stripe Id	2022-10-27 01:13:19
79	20	70	200	Data Generator Stripe Id	2022-10-27 01:13:19
81	24	42	393	Data Generator Stripe Id	2022-10-27 01:13:19
82	32	51	191	Data Generator Stripe Id	2022-10-27 01:13:19
85	13	67	136	Data Generator Stripe Id	2022-10-27 01:13:19
87	44	89	366	Data Generator Stripe Id	2022-10-27 01:13:19
89	14	15	361	Data Generator Stripe Id	2022-10-27 01:13:19
92	47	15	235	Data Generator Stripe Id	2022-10-27 01:13:19
95	13	3	136	Data Generator Stripe Id	2022-10-27 01:13:19
99	4	60	220	Data Generator Stripe Id	2022-10-27 01:13:20
102	4	96	220	Data Generator Stripe Id	2022-10-27 01:13:20
104	17	91	89	Data Generator Stripe Id	2022-10-27 01:13:20
106	18	79	376	Data Generator Stripe Id	2022-10-27 01:13:20
109	17	24	89	Data Generator Stripe Id	2022-10-27 01:13:20
112	44	52	366	Data Generator Stripe Id	2022-10-27 01:13:20
123	17	60	89	Data Generator Stripe Id	2022-10-27 01:13:20
115	17	32	89	Data Generator Stripe Id	2022-10-27 01:13:20
117	14	86	361	Data Generator Stripe Id	2022-10-27 01:13:20
125	44	62	366	Data Generator Stripe Id	2022-10-27 01:13:21
126	24	30	393	Data Generator Stripe Id	2022-10-27 01:13:21
128	35	34	259	Data Generator Stripe Id	2022-10-27 01:13:21
129	43	5	281	Data Generator Stripe Id	2022-10-27 01:13:21
130	17	11	89	Data Generator Stripe Id	2022-10-27 01:13:21
135	49	54	98	Data Generator Stripe Id	2022-10-27 01:13:21
138	13	65	136	Data Generator Stripe Id	2022-10-27 01:13:21
142	5	12	271	Data Generator Stripe Id	2022-10-27 01:13:21
151	17	55	89	Data Generator Stripe Id	2022-10-27 01:13:21
150	24	95	393	Data Generator Stripe Id	2022-10-27 01:13:21
154	4	94	220	Data Generator Stripe Id	2022-10-27 01:13:22
166	35	90	259	Data Generator Stripe Id	2022-10-27 01:13:23
170	47	29	235	Data Generator Stripe Id	2022-10-27 01:13:23
173	32	99	191	Data Generator Stripe Id	2022-10-27 01:13:23
176	17	37	89	Data Generator Stripe Id	2022-10-27 01:13:23
182	18	18	376	Data Generator Stripe Id	2022-10-27 01:13:23
184	13	88	136	Data Generator Stripe Id	2022-10-27 01:13:23
187	35	52	259	Data Generator Stripe Id	2022-10-27 01:13:23
190	18	75	376	Data Generator Stripe Id	2022-10-27 01:13:23
193	18	41	376	Data Generator Stripe Id	2022-10-27 01:13:24
196	43	47	281	Data Generator Stripe Id	2022-10-27 01:13:24
201	43	57	281	Data Generator Stripe Id	2022-10-27 01:13:24
199	47	21	235	Data Generator Stripe Id	2022-10-27 01:13:24
202	35	91	259	Data Generator Stripe Id	2022-10-27 01:13:24
207	5	18	271	Data Generator Stripe Id	2022-10-27 01:13:24
204	24	5	393	Data Generator Stripe Id	2022-10-27 01:13:24
205	14	62	361	Data Generator Stripe Id	2022-10-27 01:13:24
206	17	17	89	Data Generator Stripe Id	2022-10-27 01:13:25
212	5	17	271	Data Generator Stripe Id	2022-10-27 01:13:25
214	4	14	220	Data Generator Stripe Id	2022-10-27 01:13:25
216	18	85	376	Data Generator Stripe Id	2022-10-27 01:13:25
220	4	53	220	Data Generator Stripe Id	2022-10-27 01:13:25
222	13	4	136	Data Generator Stripe Id	2022-10-27 01:13:25
230	49	88	98	Data Generator Stripe Id	2022-10-27 01:13:25
227	49	1	98	Data Generator Stripe Id	2022-10-27 01:13:25
229	29	66	362	Data Generator Stripe Id	2022-10-27 01:13:25
236	5	12	271	Data Generator Stripe Id	2022-10-27 01:13:26
242	47	80	235	Data Generator Stripe Id	2022-10-27 01:13:26
246	5	3	271	Data Generator Stripe Id	2022-10-27 01:13:26
247	47	50	235	Data Generator Stripe Id	2022-10-27 01:13:26
252	29	21	362	Data Generator Stripe Id	2022-10-27 01:13:26
255	40	58	178	Data Generator Stripe Id	2022-10-27 01:13:26
257	29	61	362	Data Generator Stripe Id	2022-10-27 01:13:26
261	5	54	271	Data Generator Stripe Id	2022-10-27 01:13:27
265	29	41	362	Data Generator Stripe Id	2022-10-27 01:13:27
93	14	35	361	Data Generator Stripe Id	2022-10-27 01:13:19
97	49	27	98	Data Generator Stripe Id	2022-10-27 01:13:19
98	4	44	220	Data Generator Stripe Id	2022-10-27 01:13:20
103	13	41	136	Data Generator Stripe Id	2022-10-27 01:13:20
107	24	26	393	Data Generator Stripe Id	2022-10-27 01:13:20
116	17	77	89	Data Generator Stripe Id	2022-10-27 01:13:20
118	24	72	393	Data Generator Stripe Id	2022-10-27 01:13:20
120	4	89	220	Data Generator Stripe Id	2022-10-27 01:13:20
121	32	4	191	Data Generator Stripe Id	2022-10-27 01:13:21
132	47	2	235	Data Generator Stripe Id	2022-10-27 01:13:21
136	47	45	235	Data Generator Stripe Id	2022-10-27 01:13:21
134	18	10	376	Data Generator Stripe Id	2022-10-27 01:13:21
137	49	15	98	Data Generator Stripe Id	2022-10-27 01:13:21
139	14	94	361	Data Generator Stripe Id	2022-10-27 01:13:21
143	17	83	89	Data Generator Stripe Id	2022-10-27 01:13:21
144	14	80	361	Data Generator Stripe Id	2022-10-27 01:13:21
147	4	27	220	Data Generator Stripe Id	2022-10-27 01:13:21
149	38	32	375	Data Generator Stripe Id	2022-10-27 01:13:21
152	29	44	362	Data Generator Stripe Id	2022-10-27 01:13:22
158	49	48	98	Data Generator Stripe Id	2022-10-27 01:13:22
162	32	12	191	Data Generator Stripe Id	2022-10-27 01:13:23
174	20	72	200	Data Generator Stripe Id	2022-10-27 01:13:23
175	13	73	136	Data Generator Stripe Id	2022-10-27 01:13:23
177	20	75	200	Data Generator Stripe Id	2022-10-27 01:13:23
178	5	53	271	Data Generator Stripe Id	2022-10-27 01:13:23
181	20	34	200	Data Generator Stripe Id	2022-10-27 01:13:23
183	32	7	191	Data Generator Stripe Id	2022-10-27 01:13:23
185	4	57	220	Data Generator Stripe Id	2022-10-27 01:13:23
186	44	60	366	Data Generator Stripe Id	2022-10-27 01:13:23
189	40	71	178	Data Generator Stripe Id	2022-10-27 01:13:24
192	29	21	362	Data Generator Stripe Id	2022-10-27 01:13:24
194	17	86	89	Data Generator Stripe Id	2022-10-27 01:13:24
197	14	33	361	Data Generator Stripe Id	2022-10-27 01:13:24
198	5	9	271	Data Generator Stripe Id	2022-10-27 01:13:24
200	17	6	89	Data Generator Stripe Id	2022-10-27 01:13:24
203	47	58	235	Data Generator Stripe Id	2022-10-27 01:13:24
210	13	78	136	Data Generator Stripe Id	2022-10-27 01:13:25
211	18	47	376	Data Generator Stripe Id	2022-10-27 01:13:25
215	20	18	200	Data Generator Stripe Id	2022-10-27 01:13:25
217	38	46	375	Data Generator Stripe Id	2022-10-27 01:13:25
218	5	14	271	Data Generator Stripe Id	2022-10-27 01:13:25
221	13	88	136	Data Generator Stripe Id	2022-10-27 01:13:25
224	35	58	259	Data Generator Stripe Id	2022-10-27 01:13:25
226	35	93	259	Data Generator Stripe Id	2022-10-27 01:13:25
228	20	80	200	Data Generator Stripe Id	2022-10-27 01:13:25
233	13	35	136	Data Generator Stripe Id	2022-10-27 01:13:25
234	29	21	362	Data Generator Stripe Id	2022-10-27 01:13:26
237	44	70	366	Data Generator Stripe Id	2022-10-27 01:13:26
239	24	97	393	Data Generator Stripe Id	2022-10-27 01:13:26
241	5	38	271	Data Generator Stripe Id	2022-10-27 01:13:26
240	24	57	393	Data Generator Stripe Id	2022-10-27 01:13:26
254	20	5	200	Data Generator Stripe Id	2022-10-27 01:13:26
264	32	32	191	Data Generator Stripe Id	2022-10-27 01:13:27
266	47	75	235	Data Generator Stripe Id	2022-10-27 01:13:27
268	4	31	220	Data Generator Stripe Id	2022-10-27 01:13:27
278	49	39	98	Data Generator Stripe Id	2022-10-27 01:13:27
282	29	46	362	Data Generator Stripe Id	2022-10-27 01:13:28
283	44	4	366	Data Generator Stripe Id	2022-10-27 01:13:28
285	5	22	271	Data Generator Stripe Id	2022-10-27 01:13:28
287	20	1	200	Data Generator Stripe Id	2022-10-27 01:13:28
290	20	56	200	Data Generator Stripe Id	2022-10-27 01:13:28
292	13	59	136	Data Generator Stripe Id	2022-10-27 01:13:28
294	13	42	136	Data Generator Stripe Id	2022-10-27 01:13:28
297	40	82	178	Data Generator Stripe Id	2022-10-27 01:13:28
298	44	53	366	Data Generator Stripe Id	2022-10-27 01:13:28
300	49	78	98	Data Generator Stripe Id	2022-10-27 01:13:28
302	40	60	178	Data Generator Stripe Id	2022-10-27 01:13:28
303	4	83	220	Data Generator Stripe Id	2022-10-27 01:13:28
306	38	57	375	Data Generator Stripe Id	2022-10-27 01:13:29
311	4	2	220	Data Generator Stripe Id	2022-10-27 01:13:29
314	29	6	362	Data Generator Stripe Id	2022-10-27 01:13:29
318	43	46	281	Data Generator Stripe Id	2022-10-27 01:13:30
322	47	67	235	Data Generator Stripe Id	2022-10-27 01:13:30
321	18	19	376	Data Generator Stripe Id	2022-10-27 01:13:30
324	47	63	235	Data Generator Stripe Id	2022-10-27 01:13:30
330	20	35	200	Data Generator Stripe Id	2022-10-27 01:13:30
331	4	26	220	Data Generator Stripe Id	2022-10-27 01:13:30
337	18	67	376	Data Generator Stripe Id	2022-10-27 01:13:31
339	24	25	393	Data Generator Stripe Id	2022-10-27 01:13:31
338	40	61	178	Data Generator Stripe Id	2022-10-27 01:13:31
341	32	56	191	Data Generator Stripe Id	2022-10-27 01:13:31
342	40	97	178	Data Generator Stripe Id	2022-10-27 01:13:31
345	17	29	89	Data Generator Stripe Id	2022-10-27 01:13:31
352	14	19	361	Data Generator Stripe Id	2022-10-27 01:13:31
353	17	82	89	Data Generator Stripe Id	2022-10-27 01:13:31
354	49	85	98	Data Generator Stripe Id	2022-10-27 01:13:31
358	5	58	271	Data Generator Stripe Id	2022-10-27 01:13:31
360	43	86	281	Data Generator Stripe Id	2022-10-27 01:13:31
362	32	80	191	Data Generator Stripe Id	2022-10-27 01:13:31
365	13	50	136	Data Generator Stripe Id	2022-10-27 01:13:31
367	20	25	200	Data Generator Stripe Id	2022-10-27 01:13:31
368	32	65	191	Data Generator Stripe Id	2022-10-27 01:13:31
377	35	59	259	Data Generator Stripe Id	2022-10-27 01:13:32
378	38	6	375	Data Generator Stripe Id	2022-10-27 01:13:32
381	17	54	89	Data Generator Stripe Id	2022-10-27 01:13:32
383	13	87	136	Data Generator Stripe Id	2022-10-27 01:13:32
382	44	88	366	Data Generator Stripe Id	2022-10-27 01:13:32
390	44	58	366	Data Generator Stripe Id	2022-10-27 01:13:33
392	44	81	366	Data Generator Stripe Id	2022-10-27 01:13:44
395	49	13	98	Data Generator Stripe Id	2022-10-27 01:13:44
397	4	26	220	Data Generator Stripe Id	2022-10-27 01:13:44
405	35	2	259	Data Generator Stripe Id	2022-10-27 01:13:44
407	35	50	259	Data Generator Stripe Id	2022-10-27 01:13:44
409	35	96	259	Data Generator Stripe Id	2022-10-27 01:13:45
410	43	68	281	Data Generator Stripe Id	2022-10-27 01:13:45
413	24	87	393	Data Generator Stripe Id	2022-10-27 01:13:45
416	38	99	375	Data Generator Stripe Id	2022-10-27 01:13:45
421	14	9	361	Data Generator Stripe Id	2022-10-27 01:13:45
419	4	53	220	Data Generator Stripe Id	2022-10-27 01:13:45
423	29	48	362	Data Generator Stripe Id	2022-10-27 01:13:45
425	43	88	281	Data Generator Stripe Id	2022-10-27 01:13:45
426	17	16	89	Data Generator Stripe Id	2022-10-27 01:13:45
430	47	65	235	Data Generator Stripe Id	2022-10-27 01:13:46
270	24	11	393	Data Generator Stripe Id	2022-10-27 01:13:27
272	40	68	178	Data Generator Stripe Id	2022-10-27 01:13:27
274	17	68	89	Data Generator Stripe Id	2022-10-27 01:13:27
276	18	4	376	Data Generator Stripe Id	2022-10-27 01:13:28
279	35	29	259	Data Generator Stripe Id	2022-10-27 01:13:28
281	29	44	362	Data Generator Stripe Id	2022-10-27 01:13:28
286	38	67	375	Data Generator Stripe Id	2022-10-27 01:13:28
291	43	36	281	Data Generator Stripe Id	2022-10-27 01:13:28
293	40	9	178	Data Generator Stripe Id	2022-10-27 01:13:28
295	4	61	220	Data Generator Stripe Id	2022-10-27 01:13:28
296	44	63	366	Data Generator Stripe Id	2022-10-27 01:13:28
301	4	62	220	Data Generator Stripe Id	2022-10-27 01:13:28
307	40	42	178	Data Generator Stripe Id	2022-10-27 01:13:29
309	49	16	98	Data Generator Stripe Id	2022-10-27 01:13:29
312	43	57	281	Data Generator Stripe Id	2022-10-27 01:13:29
317	4	76	220	Data Generator Stripe Id	2022-10-27 01:13:29
316	24	16	393	Data Generator Stripe Id	2022-10-27 01:13:30
323	40	56	178	Data Generator Stripe Id	2022-10-27 01:13:30
327	35	61	259	Data Generator Stripe Id	2022-10-27 01:13:30
326	49	51	98	Data Generator Stripe Id	2022-10-27 01:13:30
328	38	74	375	Data Generator Stripe Id	2022-10-27 01:13:30
332	43	59	281	Data Generator Stripe Id	2022-10-27 01:13:30
333	32	88	191	Data Generator Stripe Id	2022-10-27 01:13:30
335	49	17	98	Data Generator Stripe Id	2022-10-27 01:13:31
344	5	78	271	Data Generator Stripe Id	2022-10-27 01:13:31
343	32	30	191	Data Generator Stripe Id	2022-10-27 01:13:31
348	43	35	281	Data Generator Stripe Id	2022-10-27 01:13:31
350	29	23	362	Data Generator Stripe Id	2022-10-27 01:13:31
356	14	81	361	Data Generator Stripe Id	2022-10-27 01:13:31
359	13	1	136	Data Generator Stripe Id	2022-10-27 01:13:31
364	20	2	200	Data Generator Stripe Id	2022-10-27 01:13:31
366	29	79	362	Data Generator Stripe Id	2022-10-27 01:13:31
369	17	77	89	Data Generator Stripe Id	2022-10-27 01:13:31
370	47	69	235	Data Generator Stripe Id	2022-10-27 01:13:31
373	18	59	376	Data Generator Stripe Id	2022-10-27 01:13:32
376	38	45	375	Data Generator Stripe Id	2022-10-27 01:13:32
380	32	5	191	Data Generator Stripe Id	2022-10-27 01:13:32
379	14	87	361	Data Generator Stripe Id	2022-10-27 01:13:32
384	18	70	376	Data Generator Stripe Id	2022-10-27 01:13:32
388	44	86	366	Data Generator Stripe Id	2022-10-27 01:13:32
385	17	78	89	Data Generator Stripe Id	2022-10-27 01:13:33
386	20	90	200	Data Generator Stripe Id	2022-10-27 01:13:33
391	5	30	271	Data Generator Stripe Id	2022-10-27 01:13:33
389	38	16	375	Data Generator Stripe Id	2022-10-27 01:13:33
394	5	95	271	Data Generator Stripe Id	2022-10-27 01:13:33
396	35	3	259	Data Generator Stripe Id	2022-10-27 01:13:44
399	24	19	393	Data Generator Stripe Id	2022-10-27 01:13:44
401	32	66	191	Data Generator Stripe Id	2022-10-27 01:13:44
403	49	48	98	Data Generator Stripe Id	2022-10-27 01:13:44
406	5	88	271	Data Generator Stripe Id	2022-10-27 01:13:44
412	35	26	259	Data Generator Stripe Id	2022-10-27 01:13:45
414	17	73	89	Data Generator Stripe Id	2022-10-27 01:13:45
417	35	40	259	Data Generator Stripe Id	2022-10-27 01:13:45
418	24	82	393	Data Generator Stripe Id	2022-10-27 01:13:45
422	49	34	98	Data Generator Stripe Id	2022-10-27 01:13:45
424	44	39	366	Data Generator Stripe Id	2022-10-27 01:13:45
427	32	80	191	Data Generator Stripe Id	2022-10-27 01:13:45
434	20	90	200	Data Generator Stripe Id	2022-10-27 01:13:46
433	29	85	362	Data Generator Stripe Id	2022-10-27 01:13:46
436	43	12	281	Data Generator Stripe Id	2022-10-27 01:13:46
438	14	74	361	Data Generator Stripe Id	2022-10-27 01:13:46
437	17	48	89	Data Generator Stripe Id	2022-10-27 01:13:46
441	17	94	89	Data Generator Stripe Id	2022-10-27 01:13:46
451	47	32	235	Data Generator Stripe Id	2022-10-27 01:13:47
449	20	94	200	Data Generator Stripe Id	2022-10-27 01:13:47
431	44	3	366	Data Generator Stripe Id	2022-10-27 01:13:46
432	18	28	376	Data Generator Stripe Id	2022-10-27 01:13:46
435	38	72	375	Data Generator Stripe Id	2022-10-27 01:13:46
443	17	44	89	Data Generator Stripe Id	2022-10-27 01:13:46
445	40	13	178	Data Generator Stripe Id	2022-10-27 01:13:47
446	43	8	281	Data Generator Stripe Id	2022-10-27 01:13:47
447	47	37	235	Data Generator Stripe Id	2022-10-27 01:13:47
454	24	38	393	Data Generator Stripe Id	2022-10-27 01:13:47
456	18	35	376	Data Generator Stripe Id	2022-10-27 01:13:47
459	49	37	98	Data Generator Stripe Id	2022-10-27 01:13:48
464	5	93	271	Data Generator Stripe Id	2022-10-27 01:13:48
466	17	15	89	Data Generator Stripe Id	2022-10-27 01:13:48
468	13	70	136	Data Generator Stripe Id	2022-10-27 01:13:48
470	4	9	220	Data Generator Stripe Id	2022-10-27 01:13:48
476	13	85	136	Data Generator Stripe Id	2022-10-27 01:13:48
478	5	72	271	Data Generator Stripe Id	2022-10-27 01:13:48
483	49	64	98	Data Generator Stripe Id	2022-10-27 01:13:48
487	13	48	136	Data Generator Stripe Id	2022-10-27 01:13:48
489	17	92	89	Data Generator Stripe Id	2022-10-27 01:13:49
490	47	93	235	Data Generator Stripe Id	2022-10-27 01:13:49
494	17	62	89	Data Generator Stripe Id	2022-10-27 01:13:49
495	13	69	136	Data Generator Stripe Id	2022-10-27 01:13:49
502	43	99	281	Data Generator Stripe Id	2022-10-27 01:13:49
500	5	47	271	Data Generator Stripe Id	2022-10-27 01:13:49
503	38	90	375	Data Generator Stripe Id	2022-10-27 01:13:49
507	35	79	259	Data Generator Stripe Id	2022-10-27 01:13:49
508	5	1	271	Data Generator Stripe Id	2022-10-27 01:13:49
510	18	64	376	Data Generator Stripe Id	2022-10-27 01:13:49
518	40	44	178	Data Generator Stripe Id	2022-10-27 01:13:50
521	14	35	361	Data Generator Stripe Id	2022-10-27 01:13:50
525	13	65	136	Data Generator Stripe Id	2022-10-27 01:13:50
530	5	48	271	Data Generator Stripe Id	2022-10-27 01:13:50
532	5	63	271	Data Generator Stripe Id	2022-10-27 01:13:50
534	38	77	375	Data Generator Stripe Id	2022-10-27 01:13:50
538	35	7	259	Data Generator Stripe Id	2022-10-27 01:13:50
541	38	94	375	Data Generator Stripe Id	2022-10-27 01:13:50
542	35	48	259	Data Generator Stripe Id	2022-10-27 01:13:50
553	40	50	178	Data Generator Stripe Id	2022-10-27 01:13:51
544	24	62	393	Data Generator Stripe Id	2022-10-27 01:13:51
546	4	46	220	Data Generator Stripe Id	2022-10-27 01:13:51
548	18	9	376	Data Generator Stripe Id	2022-10-27 01:13:51
552	13	28	136	Data Generator Stripe Id	2022-10-27 01:13:51
554	44	26	366	Data Generator Stripe Id	2022-10-27 01:13:51
555	32	30	191	Data Generator Stripe Id	2022-10-27 01:13:51
564	5	11	271	Data Generator Stripe Id	2022-10-27 01:13:52
560	38	53	375	Data Generator Stripe Id	2022-10-27 01:13:52
562	29	4	362	Data Generator Stripe Id	2022-10-27 01:13:52
567	18	93	376	Data Generator Stripe Id	2022-10-27 01:13:59
573	29	3	362	Data Generator Stripe Id	2022-10-27 01:13:59
579	20	68	200	Data Generator Stripe Id	2022-10-27 01:14:00
575	35	13	259	Data Generator Stripe Id	2022-10-27 01:14:00
583	38	11	375	Data Generator Stripe Id	2022-10-27 01:14:01
589	17	58	89	Data Generator Stripe Id	2022-10-27 01:14:01
597	5	98	271	Data Generator Stripe Id	2022-10-27 01:14:01
601	5	22	271	Data Generator Stripe Id	2022-10-27 01:14:01
603	17	78	89	Data Generator Stripe Id	2022-10-27 01:14:01
604	20	25	200	Data Generator Stripe Id	2022-10-27 01:14:02
611	43	11	281	Data Generator Stripe Id	2022-10-27 01:14:02
617	29	1	362	Data Generator Stripe Id	2022-10-27 01:14:02
457	13	13	136	Data Generator Stripe Id	2022-10-27 01:13:47
460	13	3	136	Data Generator Stripe Id	2022-10-27 01:13:48
461	38	73	375	Data Generator Stripe Id	2022-10-27 01:13:48
465	4	73	220	Data Generator Stripe Id	2022-10-27 01:13:48
469	47	45	235	Data Generator Stripe Id	2022-10-27 01:13:48
471	35	72	259	Data Generator Stripe Id	2022-10-27 01:13:48
475	38	61	375	Data Generator Stripe Id	2022-10-27 01:13:48
474	29	90	362	Data Generator Stripe Id	2022-10-27 01:13:48
479	44	36	366	Data Generator Stripe Id	2022-10-27 01:13:48
480	14	17	361	Data Generator Stripe Id	2022-10-27 01:13:48
482	20	10	200	Data Generator Stripe Id	2022-10-27 01:13:48
484	35	69	259	Data Generator Stripe Id	2022-10-27 01:13:48
488	47	8	235	Data Generator Stripe Id	2022-10-27 01:13:49
492	13	49	136	Data Generator Stripe Id	2022-10-27 01:13:49
493	18	3	376	Data Generator Stripe Id	2022-10-27 01:13:49
496	35	59	259	Data Generator Stripe Id	2022-10-27 01:13:49
501	5	80	271	Data Generator Stripe Id	2022-10-27 01:13:49
511	35	70	259	Data Generator Stripe Id	2022-10-27 01:13:49
513	4	31	220	Data Generator Stripe Id	2022-10-27 01:13:49
516	17	10	89	Data Generator Stripe Id	2022-10-27 01:13:49
519	13	1	136	Data Generator Stripe Id	2022-10-27 01:13:50
522	38	64	375	Data Generator Stripe Id	2022-10-27 01:13:50
524	47	36	235	Data Generator Stripe Id	2022-10-27 01:13:50
527	29	68	362	Data Generator Stripe Id	2022-10-27 01:13:50
526	32	32	191	Data Generator Stripe Id	2022-10-27 01:13:50
529	38	23	375	Data Generator Stripe Id	2022-10-27 01:13:50
528	24	56	393	Data Generator Stripe Id	2022-10-27 01:13:50
531	13	5	136	Data Generator Stripe Id	2022-10-27 01:13:50
533	13	3	136	Data Generator Stripe Id	2022-10-27 01:13:50
537	5	77	271	Data Generator Stripe Id	2022-10-27 01:13:50
536	44	53	366	Data Generator Stripe Id	2022-10-27 01:13:50
539	38	54	375	Data Generator Stripe Id	2022-10-27 01:13:50
540	47	58	235	Data Generator Stripe Id	2022-10-27 01:13:50
543	4	15	220	Data Generator Stripe Id	2022-10-27 01:13:50
545	32	13	191	Data Generator Stripe Id	2022-10-27 01:13:51
549	5	5	271	Data Generator Stripe Id	2022-10-27 01:13:51
556	13	15	136	Data Generator Stripe Id	2022-10-27 01:13:51
559	49	81	98	Data Generator Stripe Id	2022-10-27 01:13:52
561	38	77	375	Data Generator Stripe Id	2022-10-27 01:13:52
563	43	31	281	Data Generator Stripe Id	2022-10-27 01:13:52
571	38	38	375	Data Generator Stripe Id	2022-10-27 01:13:59
569	17	48	89	Data Generator Stripe Id	2022-10-27 01:13:59
572	24	69	393	Data Generator Stripe Id	2022-10-27 01:13:59
574	17	70	89	Data Generator Stripe Id	2022-10-27 01:14:00
577	47	7	235	Data Generator Stripe Id	2022-10-27 01:14:00
578	4	59	220	Data Generator Stripe Id	2022-10-27 01:14:00
581	40	76	178	Data Generator Stripe Id	2022-10-27 01:14:00
584	44	38	366	Data Generator Stripe Id	2022-10-27 01:14:00
582	47	39	235	Data Generator Stripe Id	2022-10-27 01:14:01
585	40	61	178	Data Generator Stripe Id	2022-10-27 01:14:01
587	20	21	200	Data Generator Stripe Id	2022-10-27 01:14:01
590	24	95	393	Data Generator Stripe Id	2022-10-27 01:14:01
594	18	41	376	Data Generator Stripe Id	2022-10-27 01:14:01
596	38	28	375	Data Generator Stripe Id	2022-10-27 01:14:01
600	18	33	376	Data Generator Stripe Id	2022-10-27 01:14:01
598	24	74	393	Data Generator Stripe Id	2022-10-27 01:14:01
599	13	49	136	Data Generator Stripe Id	2022-10-27 01:14:01
602	5	65	271	Data Generator Stripe Id	2022-10-27 01:14:02
605	20	82	200	Data Generator Stripe Id	2022-10-27 01:14:02
612	4	35	220	Data Generator Stripe Id	2022-10-27 01:14:02
613	47	12	235	Data Generator Stripe Id	2022-10-27 01:14:02
615	4	64	220	Data Generator Stripe Id	2022-10-27 01:14:02
616	43	62	281	Data Generator Stripe Id	2022-10-27 01:14:02
619	47	28	235	Data Generator Stripe Id	2022-10-27 01:14:02
622	18	32	376	Data Generator Stripe Id	2022-10-27 01:14:03
624	49	27	98	Data Generator Stripe Id	2022-10-27 01:14:03
630	13	37	136	Data Generator Stripe Id	2022-10-27 01:14:03
634	32	72	191	Data Generator Stripe Id	2022-10-27 01:14:07
637	47	38	235	Data Generator Stripe Id	2022-10-27 01:14:08
641	49	28	98	Data Generator Stripe Id	2022-10-27 01:14:08
646	4	16	220	Data Generator Stripe Id	2022-10-27 01:14:08
654	13	10	136	Data Generator Stripe Id	2022-10-27 01:14:09
657	38	85	375	Data Generator Stripe Id	2022-10-27 01:14:09
656	29	98	362	Data Generator Stripe Id	2022-10-27 01:14:09
666	18	23	376	Data Generator Stripe Id	2022-10-27 01:14:09
1182	14	98	361	Data Generator Stripe Id	2022-10-27 01:20:19
1184	38	10	375	Data Generator Stripe Id	2022-10-27 01:20:19
618	49	41	98	Data Generator Stripe Id	2022-10-27 01:14:02
621	5	3	271	Data Generator Stripe Id	2022-10-27 01:14:02
629	24	93	393	Data Generator Stripe Id	2022-10-27 01:14:03
628	35	17	259	Data Generator Stripe Id	2022-10-27 01:14:03
632	44	54	366	Data Generator Stripe Id	2022-10-27 01:14:07
633	5	80	271	Data Generator Stripe Id	2022-10-27 01:14:07
635	40	77	178	Data Generator Stripe Id	2022-10-27 01:14:08
638	47	98	235	Data Generator Stripe Id	2022-10-27 01:14:08
640	20	32	200	Data Generator Stripe Id	2022-10-27 01:14:08
645	4	94	220	Data Generator Stripe Id	2022-10-27 01:14:08
649	35	83	259	Data Generator Stripe Id	2022-10-27 01:14:09
647	4	83	220	Data Generator Stripe Id	2022-10-27 01:14:09
650	18	32	376	Data Generator Stripe Id	2022-10-27 01:14:09
653	40	2	178	Data Generator Stripe Id	2022-10-27 01:14:09
652	29	88	362	Data Generator Stripe Id	2022-10-27 01:14:09
661	49	39	98	Data Generator Stripe Id	2022-10-27 01:14:09
663	29	40	362	Data Generator Stripe Id	2022-10-27 01:14:09
665	49	52	98	Data Generator Stripe Id	2022-10-27 01:14:10
669	24	77	393	Data Generator Stripe Id	2022-10-27 01:16:10
667	5	66	271	Data Generator Stripe Id	2022-10-27 01:16:10
668	47	77	235	Data Generator Stripe Id	2022-10-27 01:16:10
670	40	4	178	Data Generator Stripe Id	2022-10-27 01:16:10
671	18	86	376	Data Generator Stripe Id	2022-10-27 01:16:10
672	49	49	98	Data Generator Stripe Id	2022-10-27 01:16:10
675	47	60	235	Data Generator Stripe Id	2022-10-27 01:16:11
674	49	94	98	Data Generator Stripe Id	2022-10-27 01:16:11
678	24	94	393	Data Generator Stripe Id	2022-10-27 01:16:11
676	35	11	259	Data Generator Stripe Id	2022-10-27 01:16:11
680	40	22	178	Data Generator Stripe Id	2022-10-27 01:16:11
684	4	98	220	Data Generator Stripe Id	2022-10-27 01:16:11
683	4	8	220	Data Generator Stripe Id	2022-10-27 01:16:11
685	9	19	40	Data Generator Stripe Id	2022-10-27 01:19:54
686	49	46	98	Data Generator Stripe Id	2022-10-27 01:19:58
687	35	21	259	Data Generator Stripe Id	2022-10-27 01:19:58
688	40	66	178	Data Generator Stripe Id	2022-10-27 01:19:58
689	46	31	380	Data Generator Stripe Id	2022-10-27 01:19:58
691	44	91	366	Data Generator Stripe Id	2022-10-27 01:19:58
693	24	56	393	Data Generator Stripe Id	2022-10-27 01:19:59
694	43	60	281	Data Generator Stripe Id	2022-10-27 01:19:59
696	5	2	271	Data Generator Stripe Id	2022-10-27 01:19:59
699	40	63	178	Data Generator Stripe Id	2022-10-27 01:19:59
700	33	13	96	Data Generator Stripe Id	2022-10-27 01:19:59
701	31	56	300	Data Generator Stripe Id	2022-10-27 01:19:59
702	40	91	178	Data Generator Stripe Id	2022-10-27 01:19:59
706	44	26	366	Data Generator Stripe Id	2022-10-27 01:19:59
707	50	87	290	Data Generator Stripe Id	2022-10-27 01:19:59
716	42	31	293	Data Generator Stripe Id	2022-10-27 01:19:59
718	26	75	290	Data Generator Stripe Id	2022-10-27 01:19:59
720	29	77	362	Data Generator Stripe Id	2022-10-27 01:19:59
721	48	8	214	Data Generator Stripe Id	2022-10-27 01:19:59
722	33	77	96	Data Generator Stripe Id	2022-10-27 01:19:59
723	42	67	293	Data Generator Stripe Id	2022-10-27 01:19:59
724	29	8	362	Data Generator Stripe Id	2022-10-27 01:19:59
725	18	55	376	Data Generator Stripe Id	2022-10-27 01:19:59
726	43	95	281	Data Generator Stripe Id	2022-10-27 01:19:59
727	5	80	271	Data Generator Stripe Id	2022-10-27 01:19:59
731	5	80	271	Data Generator Stripe Id	2022-10-27 01:19:59
732	20	55	200	Data Generator Stripe Id	2022-10-27 01:19:59
734	44	98	366	Data Generator Stripe Id	2022-10-27 01:19:59
735	49	66	98	Data Generator Stripe Id	2022-10-27 01:19:59
736	49	63	98	Data Generator Stripe Id	2022-10-27 01:19:59
737	37	68	350	Data Generator Stripe Id	2022-10-27 01:19:59
738	40	97	178	Data Generator Stripe Id	2022-10-27 01:19:59
739	15	17	241	Data Generator Stripe Id	2022-10-27 01:19:59
740	13	39	136	Data Generator Stripe Id	2022-10-27 01:19:59
741	24	3	393	Data Generator Stripe Id	2022-10-27 01:19:59
742	20	96	200	Data Generator Stripe Id	2022-10-27 01:19:59
744	14	53	361	Data Generator Stripe Id	2022-10-27 01:19:59
745	32	12	191	Data Generator Stripe Id	2022-10-27 01:19:59
746	49	55	98	Data Generator Stripe Id	2022-10-27 01:19:59
747	50	20	290	Data Generator Stripe Id	2022-10-27 01:19:59
748	7	2	289	Data Generator Stripe Id	2022-10-27 01:19:59
749	5	50	271	Data Generator Stripe Id	2022-10-27 01:19:59
751	24	75	393	Data Generator Stripe Id	2022-10-27 01:19:59
752	9	7	40	Data Generator Stripe Id	2022-10-27 01:19:59
755	33	25	96	Data Generator Stripe Id	2022-10-27 01:19:59
757	37	40	350	Data Generator Stripe Id	2022-10-27 01:19:59
761	33	40	96	Data Generator Stripe Id	2022-10-27 01:19:59
764	42	25	293	Data Generator Stripe Id	2022-10-27 01:19:59
765	42	13	293	Data Generator Stripe Id	2022-10-27 01:19:59
766	33	34	96	Data Generator Stripe Id	2022-10-27 01:19:59
767	43	74	281	Data Generator Stripe Id	2022-10-27 01:19:59
768	44	74	366	Data Generator Stripe Id	2022-10-27 01:19:59
771	13	60	136	Data Generator Stripe Id	2022-10-27 01:19:59
772	20	38	200	Data Generator Stripe Id	2022-10-27 01:19:59
775	33	77	96	Data Generator Stripe Id	2022-10-27 01:19:59
776	29	92	362	Data Generator Stripe Id	2022-10-27 01:19:59
777	31	45	300	Data Generator Stripe Id	2022-10-27 01:19:59
778	9	84	40	Data Generator Stripe Id	2022-10-27 01:19:59
781	15	13	241	Data Generator Stripe Id	2022-10-27 01:19:59
783	46	66	380	Data Generator Stripe Id	2022-10-27 01:19:59
785	7	64	289	Data Generator Stripe Id	2022-10-27 01:19:59
786	44	86	366	Data Generator Stripe Id	2022-10-27 01:19:59
788	15	98	241	Data Generator Stripe Id	2022-10-27 01:19:59
789	6	78	298	Data Generator Stripe Id	2022-10-27 01:19:59
790	32	62	191	Data Generator Stripe Id	2022-10-27 01:19:59
791	17	19	89	Data Generator Stripe Id	2022-10-27 01:19:59
792	43	71	281	Data Generator Stripe Id	2022-10-27 01:19:59
794	24	15	393	Data Generator Stripe Id	2022-10-27 01:19:59
795	42	46	293	Data Generator Stripe Id	2022-10-27 01:19:59
797	5	54	271	Data Generator Stripe Id	2022-10-27 01:19:59
800	44	89	366	Data Generator Stripe Id	2022-10-27 01:20:00
801	7	88	289	Data Generator Stripe Id	2022-10-27 01:20:00
803	20	79	200	Data Generator Stripe Id	2022-10-27 01:20:00
805	42	72	293	Data Generator Stripe Id	2022-10-27 01:20:00
808	50	79	290	Data Generator Stripe Id	2022-10-27 01:20:00
810	46	42	380	Data Generator Stripe Id	2022-10-27 01:20:00
813	37	19	350	Data Generator Stripe Id	2022-10-27 01:20:00
815	13	88	136	Data Generator Stripe Id	2022-10-27 01:20:00
818	49	21	98	Data Generator Stripe Id	2022-10-27 01:20:00
820	20	59	200	Data Generator Stripe Id	2022-10-27 01:20:00
821	17	23	89	Data Generator Stripe Id	2022-10-27 01:20:00
822	44	6	366	Data Generator Stripe Id	2022-10-27 01:20:00
823	42	47	293	Data Generator Stripe Id	2022-10-27 01:20:00
824	24	29	393	Data Generator Stripe Id	2022-10-27 01:20:00
825	6	59	298	Data Generator Stripe Id	2022-10-27 01:20:00
826	40	65	178	Data Generator Stripe Id	2022-10-27 01:20:00
827	15	8	241	Data Generator Stripe Id	2022-10-27 01:20:00
831	9	39	40	Data Generator Stripe Id	2022-10-27 01:20:00
833	18	67	376	Data Generator Stripe Id	2022-10-27 01:20:00
834	6	99	298	Data Generator Stripe Id	2022-10-27 01:20:00
835	49	64	98	Data Generator Stripe Id	2022-10-27 01:20:00
836	38	85	375	Data Generator Stripe Id	2022-10-27 01:20:00
837	4	82	220	Data Generator Stripe Id	2022-10-27 01:20:00
838	29	93	362	Data Generator Stripe Id	2022-10-27 01:20:00
839	38	40	375	Data Generator Stripe Id	2022-10-27 01:20:00
841	17	52	89	Data Generator Stripe Id	2022-10-27 01:20:00
842	17	94	89	Data Generator Stripe Id	2022-10-27 01:20:00
844	7	50	289	Data Generator Stripe Id	2022-10-27 01:20:00
845	37	53	350	Data Generator Stripe Id	2022-10-27 01:20:00
847	50	31	290	Data Generator Stripe Id	2022-10-27 01:20:00
848	37	32	350	Data Generator Stripe Id	2022-10-27 01:20:00
850	17	91	89	Data Generator Stripe Id	2022-10-27 01:20:00
852	33	7	96	Data Generator Stripe Id	2022-10-27 01:20:00
854	32	9	191	Data Generator Stripe Id	2022-10-27 01:20:00
856	50	22	290	Data Generator Stripe Id	2022-10-27 01:20:00
859	15	59	241	Data Generator Stripe Id	2022-10-27 01:20:00
860	24	67	393	Data Generator Stripe Id	2022-10-27 01:20:00
861	50	85	290	Data Generator Stripe Id	2022-10-27 01:20:00
863	4	4	220	Data Generator Stripe Id	2022-10-27 01:20:00
864	49	45	98	Data Generator Stripe Id	2022-10-27 01:20:00
865	18	92	376	Data Generator Stripe Id	2022-10-27 01:20:00
867	18	82	376	Data Generator Stripe Id	2022-10-27 01:20:00
868	35	14	259	Data Generator Stripe Id	2022-10-27 01:20:00
869	42	83	293	Data Generator Stripe Id	2022-10-27 01:20:00
870	35	18	259	Data Generator Stripe Id	2022-10-27 01:20:00
874	31	70	300	Data Generator Stripe Id	2022-10-27 01:20:00
875	48	13	214	Data Generator Stripe Id	2022-10-27 01:20:00
877	4	99	220	Data Generator Stripe Id	2022-10-27 01:20:00
878	32	15	191	Data Generator Stripe Id	2022-10-27 01:20:00
886	35	54	259	Data Generator Stripe Id	2022-10-27 01:20:00
887	17	15	89	Data Generator Stripe Id	2022-10-27 01:20:00
889	20	31	200	Data Generator Stripe Id	2022-10-27 01:20:00
890	6	96	298	Data Generator Stripe Id	2022-10-27 01:20:00
891	14	16	361	Data Generator Stripe Id	2022-10-27 01:20:00
893	40	25	178	Data Generator Stripe Id	2022-10-27 01:20:00
894	31	1	300	Data Generator Stripe Id	2022-10-27 01:20:00
896	18	35	376	Data Generator Stripe Id	2022-10-27 01:20:00
900	26	55	290	Data Generator Stripe Id	2022-10-27 01:20:00
902	46	48	380	Data Generator Stripe Id	2022-10-27 01:20:01
904	15	98	241	Data Generator Stripe Id	2022-10-27 01:20:01
905	38	66	375	Data Generator Stripe Id	2022-10-27 01:20:01
906	32	84	191	Data Generator Stripe Id	2022-10-27 01:20:01
907	18	4	376	Data Generator Stripe Id	2022-10-27 01:20:01
908	9	18	40	Data Generator Stripe Id	2022-10-27 01:20:01
909	13	49	136	Data Generator Stripe Id	2022-10-27 01:20:01
911	32	53	191	Data Generator Stripe Id	2022-10-27 01:20:01
912	29	70	362	Data Generator Stripe Id	2022-10-27 01:20:01
915	5	71	271	Data Generator Stripe Id	2022-10-27 01:20:01
916	18	13	376	Data Generator Stripe Id	2022-10-27 01:20:01
917	7	66	289	Data Generator Stripe Id	2022-10-27 01:20:01
918	14	62	361	Data Generator Stripe Id	2022-10-27 01:20:01
922	37	62	350	Data Generator Stripe Id	2022-10-27 01:20:01
923	31	32	300	Data Generator Stripe Id	2022-10-27 01:20:01
928	5	3	271	Data Generator Stripe Id	2022-10-27 01:20:01
929	4	34	220	Data Generator Stripe Id	2022-10-27 01:20:01
930	31	34	300	Data Generator Stripe Id	2022-10-27 01:20:01
935	50	50	290	Data Generator Stripe Id	2022-10-27 01:20:01
937	13	99	136	Data Generator Stripe Id	2022-10-27 01:20:01
939	50	76	290	Data Generator Stripe Id	2022-10-27 01:20:01
940	26	41	290	Data Generator Stripe Id	2022-10-27 01:20:01
941	44	37	366	Data Generator Stripe Id	2022-10-27 01:20:01
943	9	63	40	Data Generator Stripe Id	2022-10-27 01:20:01
945	46	16	380	Data Generator Stripe Id	2022-10-27 01:20:01
946	17	89	89	Data Generator Stripe Id	2022-10-27 01:20:01
947	4	43	220	Data Generator Stripe Id	2022-10-27 01:20:01
950	17	29	89	Data Generator Stripe Id	2022-10-27 01:20:01
951	48	35	214	Data Generator Stripe Id	2022-10-27 01:20:01
952	44	78	366	Data Generator Stripe Id	2022-10-27 01:20:01
953	15	6	241	Data Generator Stripe Id	2022-10-27 01:20:01
955	40	31	178	Data Generator Stripe Id	2022-10-27 01:20:01
956	38	57	375	Data Generator Stripe Id	2022-10-27 01:20:01
957	46	36	380	Data Generator Stripe Id	2022-10-27 01:20:01
959	14	86	361	Data Generator Stripe Id	2022-10-27 01:20:01
960	43	74	281	Data Generator Stripe Id	2022-10-27 01:20:01
961	14	46	361	Data Generator Stripe Id	2022-10-27 01:20:01
962	29	51	362	Data Generator Stripe Id	2022-10-27 01:20:01
963	43	68	281	Data Generator Stripe Id	2022-10-27 01:20:01
964	5	43	271	Data Generator Stripe Id	2022-10-27 01:20:01
968	46	28	380	Data Generator Stripe Id	2022-10-27 01:20:01
969	46	96	380	Data Generator Stripe Id	2022-10-27 01:20:01
970	37	44	350	Data Generator Stripe Id	2022-10-27 01:20:01
972	50	23	290	Data Generator Stripe Id	2022-10-27 01:20:01
978	29	68	362	Data Generator Stripe Id	2022-10-27 01:20:01
979	4	25	220	Data Generator Stripe Id	2022-10-27 01:20:01
980	46	34	380	Data Generator Stripe Id	2022-10-27 01:20:01
982	18	13	376	Data Generator Stripe Id	2022-10-27 01:20:01
983	32	43	191	Data Generator Stripe Id	2022-10-27 01:20:01
985	14	5	361	Data Generator Stripe Id	2022-10-27 01:20:01
987	4	67	220	Data Generator Stripe Id	2022-10-27 01:20:01
990	42	59	293	Data Generator Stripe Id	2022-10-27 01:20:01
992	5	73	271	Data Generator Stripe Id	2022-10-27 01:20:01
993	4	28	220	Data Generator Stripe Id	2022-10-27 01:20:01
994	46	76	380	Data Generator Stripe Id	2022-10-27 01:20:01
997	15	21	241	Data Generator Stripe Id	2022-10-27 01:20:01
998	9	27	40	Data Generator Stripe Id	2022-10-27 01:20:02
999	37	26	350	Data Generator Stripe Id	2022-10-27 01:20:02
1004	46	49	380	Data Generator Stripe Id	2022-10-27 01:20:02
1005	13	55	136	Data Generator Stripe Id	2022-10-27 01:20:02
1007	14	26	361	Data Generator Stripe Id	2022-10-27 01:20:02
1008	33	6	96	Data Generator Stripe Id	2022-10-27 01:20:02
1009	26	25	290	Data Generator Stripe Id	2022-10-27 01:20:02
1012	42	66	293	Data Generator Stripe Id	2022-10-27 01:20:02
1013	18	5	376	Data Generator Stripe Id	2022-10-27 01:20:02
1014	5	17	271	Data Generator Stripe Id	2022-10-27 01:20:02
1016	44	48	366	Data Generator Stripe Id	2022-10-27 01:20:02
1017	17	70	89	Data Generator Stripe Id	2022-10-27 01:20:02
1024	46	78	380	Data Generator Stripe Id	2022-10-27 01:20:02
1025	44	23	366	Data Generator Stripe Id	2022-10-27 01:20:02
1026	14	24	361	Data Generator Stripe Id	2022-10-27 01:20:02
1027	4	87	220	Data Generator Stripe Id	2022-10-27 01:20:02
1029	29	6	362	Data Generator Stripe Id	2022-10-27 01:20:02
1031	31	20	300	Data Generator Stripe Id	2022-10-27 01:20:02
1033	35	34	259	Data Generator Stripe Id	2022-10-27 01:20:02
1034	9	57	40	Data Generator Stripe Id	2022-10-27 01:20:02
1035	5	8	271	Data Generator Stripe Id	2022-10-27 01:20:02
1036	5	46	271	Data Generator Stripe Id	2022-10-27 01:20:02
1038	35	9	259	Data Generator Stripe Id	2022-10-27 01:20:02
1039	5	3	271	Data Generator Stripe Id	2022-10-27 01:20:02
1040	46	82	380	Data Generator Stripe Id	2022-10-27 01:20:02
1041	5	12	271	Data Generator Stripe Id	2022-10-27 01:20:02
1042	44	94	366	Data Generator Stripe Id	2022-10-27 01:20:02
1043	4	55	220	Data Generator Stripe Id	2022-10-27 01:20:02
1044	43	14	281	Data Generator Stripe Id	2022-10-27 01:20:02
1047	15	76	241	Data Generator Stripe Id	2022-10-27 01:20:02
1048	29	36	362	Data Generator Stripe Id	2022-10-27 01:20:02
1051	8	68	83	Data Generator Stripe Id	2022-10-27 01:20:02
1053	40	96	178	Data Generator Stripe Id	2022-10-27 01:20:02
1054	29	92	362	Data Generator Stripe Id	2022-10-27 01:20:02
1056	40	38	178	Data Generator Stripe Id	2022-10-27 01:20:02
1057	44	35	366	Data Generator Stripe Id	2022-10-27 01:20:02
1059	49	23	98	Data Generator Stripe Id	2022-10-27 01:20:02
1060	33	38	96	Data Generator Stripe Id	2022-10-27 01:20:02
1061	29	48	362	Data Generator Stripe Id	2022-10-27 01:20:02
1062	5	39	271	Data Generator Stripe Id	2022-10-27 01:20:02
1063	33	34	96	Data Generator Stripe Id	2022-10-27 01:20:02
1064	33	40	96	Data Generator Stripe Id	2022-10-27 01:20:02
1068	46	66	380	Data Generator Stripe Id	2022-10-27 01:20:02
1073	44	17	366	Data Generator Stripe Id	2022-10-27 01:20:03
1076	35	91	259	Data Generator Stripe Id	2022-10-27 01:20:03
1077	8	17	83	Data Generator Stripe Id	2022-10-27 01:20:03
1078	35	51	259	Data Generator Stripe Id	2022-10-27 01:20:03
1079	5	5	271	Data Generator Stripe Id	2022-10-27 01:20:03
1082	44	56	366	Data Generator Stripe Id	2022-10-27 01:20:03
1084	4	19	220	Data Generator Stripe Id	2022-10-27 01:20:03
1085	6	95	298	Data Generator Stripe Id	2022-10-27 01:20:03
1087	43	60	281	Data Generator Stripe Id	2022-10-27 01:20:03
1089	46	33	380	Data Generator Stripe Id	2022-10-27 01:20:03
1090	9	87	40	Data Generator Stripe Id	2022-10-27 01:20:03
1091	38	17	375	Data Generator Stripe Id	2022-10-27 01:20:03
1092	18	27	376	Data Generator Stripe Id	2022-10-27 01:20:03
1093	17	7	89	Data Generator Stripe Id	2022-10-27 01:20:03
1094	14	75	361	Data Generator Stripe Id	2022-10-27 01:20:03
1095	35	91	259	Data Generator Stripe Id	2022-10-27 01:20:03
1100	9	3	40	Data Generator Stripe Id	2022-10-27 01:20:03
1102	43	7	281	Data Generator Stripe Id	2022-10-27 01:20:03
1103	50	6	290	Data Generator Stripe Id	2022-10-27 01:20:03
1104	40	92	178	Data Generator Stripe Id	2022-10-27 01:20:03
1105	31	33	300	Data Generator Stripe Id	2022-10-27 01:20:03
1111	20	31	200	Data Generator Stripe Id	2022-10-27 01:20:03
1113	18	13	376	Data Generator Stripe Id	2022-10-27 01:20:03
1115	37	72	350	Data Generator Stripe Id	2022-10-27 01:20:03
1117	43	38	281	Data Generator Stripe Id	2022-10-27 01:20:03
1118	44	78	366	Data Generator Stripe Id	2022-10-27 01:20:03
1119	48	62	214	Data Generator Stripe Id	2022-10-27 01:20:03
1120	38	70	375	Data Generator Stripe Id	2022-10-27 01:20:03
1121	24	15	393	Data Generator Stripe Id	2022-10-27 01:20:03
1125	8	37	83	Data Generator Stripe Id	2022-10-27 01:20:03
1126	40	48	178	Data Generator Stripe Id	2022-10-27 01:20:03
1127	14	99	361	Data Generator Stripe Id	2022-10-27 01:20:03
1128	6	94	298	Data Generator Stripe Id	2022-10-27 01:20:03
1129	40	86	178	Data Generator Stripe Id	2022-10-27 01:20:03
1130	40	17	178	Data Generator Stripe Id	2022-10-27 01:20:03
1132	37	81	350	Data Generator Stripe Id	2022-10-27 01:20:03
1134	17	3	89	Data Generator Stripe Id	2022-10-27 01:20:03
1137	24	66	393	Data Generator Stripe Id	2022-10-27 01:20:03
1140	42	24	293	Data Generator Stripe Id	2022-10-27 01:20:03
1144	7	55	289	Data Generator Stripe Id	2022-10-27 01:20:03
1145	13	55	136	Data Generator Stripe Id	2022-10-27 01:20:03
1146	40	76	178	Data Generator Stripe Id	2022-10-27 01:20:03
1147	4	38	220	Data Generator Stripe Id	2022-10-27 01:20:03
1148	5	5	271	Data Generator Stripe Id	2022-10-27 01:20:03
1149	9	17	40	Data Generator Stripe Id	2022-10-27 01:20:03
1150	7	25	289	Data Generator Stripe Id	2022-10-27 01:20:09
1154	8	21	83	Data Generator Stripe Id	2022-10-27 01:20:10
1155	29	70	362	Data Generator Stripe Id	2022-10-27 01:20:10
1156	43	34	281	Data Generator Stripe Id	2022-10-27 01:20:10
1157	50	32	290	Data Generator Stripe Id	2022-10-27 01:20:10
1158	37	10	350	Data Generator Stripe Id	2022-10-27 01:20:10
1159	46	29	380	Data Generator Stripe Id	2022-10-27 01:20:10
1163	14	4	361	Data Generator Stripe Id	2022-10-27 01:20:10
1165	35	60	259	Data Generator Stripe Id	2022-10-27 01:20:10
1166	13	94	136	Data Generator Stripe Id	2022-10-27 01:20:10
1167	17	4	89	Data Generator Stripe Id	2022-10-27 01:20:10
1168	49	80	98	Data Generator Stripe Id	2022-10-27 01:20:10
1169	26	88	290	Data Generator Stripe Id	2022-10-27 01:20:10
1170	4	39	220	Data Generator Stripe Id	2022-10-27 01:20:10
1171	15	95	241	Data Generator Stripe Id	2022-10-27 01:20:10
1173	40	1	178	Data Generator Stripe Id	2022-10-27 01:20:10
1174	42	84	293	Data Generator Stripe Id	2022-10-27 01:20:10
1175	37	31	350	Data Generator Stripe Id	2022-10-27 01:20:10
1176	7	43	289	Data Generator Stripe Id	2022-10-27 01:20:10
1178	7	80	289	Data Generator Stripe Id	2022-10-27 01:20:10
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".users (id, username, password, email, user_role) FROM stdin;
34	IBP0BK6A	6787695	NJGC90	3
35	GL01Y1OK	3553255	0068YY	3
36	4KZ99QXF	6869908	99JWCE	3
37	Y5PE5XA9	9156979	AXBAO0	3
38	TF3QNYVJ	7435517	Z1XFXV	3
39	WZFSGJ91	8431949	OFX0S4	3
40	E6S0KY6S	6703102	HISNDI	3
41	WW7G0RP0	7113461	ABM4N0	3
42	7IB51DJU	3993946	PR5KWX	3
43	2P0XKW1Y	3516487	9GSG85	3
44	OOUZOER2	8001109	T7V5MV	3
45	NJAP4BBA	5699001	JGPP94	3
46	4IME9BBP	8197645	6MZC7H	3
47	ATW0QDKU	1549017	CP5PNX	3
48	RF8G3ZP6	0649670	2PTQDZ	3
49	WOV3SN14	0249951	96NDNI	3
50	Q6FA8RH3	5901339	D9NCCC	3
51	MWSOTZI2	2918865	2UZO05	3
52	MIBWJRZ8	2134826	XPJ0U1	3
53	P7F6BCYT	8101068	PUNI27	3
54	9TRDIUHA	4790964	T63W45	3
55	ZPZKV6R1	3574894	76R56V	3
56	WBH338XK	0135356	88BYCL	3
57	WS1UYOK0	2283650	6LP8IH	3
58	KS2GQHUU	7396733	YQEMZV	3
59	LVPPSW78	5397946	BSA7X5	3
60	BBNZ07N6	5718475	LNT4L4	3
100	admin4	admin4	admin4@gmail.com	3
32	9Q6CU4GR	3329843	5GWDFA	3
31	davidw12345	4034984	PCKGIX	3
4	kelton05818	x-:p2pm@;k668	hellen07@24hinbox.com	1
5	christiansenjor256	q4[pl{6qimz6660	hkreiger@mailsaviors.com	1
6	znicolas719	*&|?7wlp!s|py713	frami.velva@tubidu.com	1
7	jtreutel269	luyxs1pg~1w,h9fh914	norma.koch@digimexplus.com	1
8	djaskolski954	|(ex{g~k2vrf=95	reichel.van@luddo.me	1
9	elliekuhic371	%[opm$kil#/(9166	daphnee23@hypoordip.live	1
10	jeffereywinthei318	j|et:vsdelt)jphid5a141	goyette.jeramie@chantellegribbon.com	1
11	cbarton573	dme+%*;g7tp:(m337	dietrich.milan@espadahost.com	1
12	connmarjolaine920	vq1y}c4\\ek54wj_w~211	dsipes@imaanpharmacy.com	1
13	audreanne55122	#1.w@@pugi(?f505	vito.herman@redaksikabar.com	1
14	windlerted580	uj-nxobj~d0'922	monahan.diego@chaatalop.store	1
15	murl74327	v*x!\\eawc;'\\j7272	alberto08@chaatalop.store	1
16	vince91459	"a^;!;gz4n)886	zelma81@tigo.tk	1
17	keagan2323	oiwbid9yj9y898	shania90@tedesafia.com	1
18	mhahn151	_eu6[:)f%h\\z`qk932	heidi21@hotmail.red	1
19	caterina0319	i%ujwbnb7coa3%0xoc,n510	howe.jasper@superhostformula.com	1
20	hodkiewiczloren436	,bg{/rwags428	fabian36@greendike.com	1
21	herbert44766	`[a1wc;u$y:fvj-208	catalina.west@uwucheck.com	1
22	mbailey526	hil#,.1zv:fr7m703	arianna16@adsensekorea.com	1
23	uhermann637	wu{b|~pt9?{g|yh285	xvon@cuedigy.com	1
24	jarrett22391	*a}pxw1svga212	jarrett.metz@shanghongs.com	1
25	medhurstivory674	j~d*^.vvuz;&p7gww.!v989	ethan83@22jharots.com	1
26	allene01817	uu6t,c:&p=216	cummerata.donal@speedupmail.us	1
27	kbogisich73	mby[di|s9|:c?mma695	schmidt.beryl@alvinneo.com	1
28	balistreriaugus140	=r^6f`ta|a=sc~x210	neha.mueller@4freemail.org	1
29	wtorphy977	ls$ueeqcu1ao+pkyhv6	fae20@stanford-university.education	1
30	chaim86834	ka6u|@-qp\\m]a~913	turcotte.jovan@gmailvn.net	1
33	mckenzieward468	gnox9&p#q0:%^d451	fwalsh@casanovalar.com	1
61	kennith20595	`ruf#dgty{em/i|38	lueilwitz.justy@mailcuk.com	1
62	libby1481	\\b(1p^:;:q!`svfa,6we540	giovanny.reynol@tedesafia.com	1
63	jaquelin31921	k1zruuo8nr$p934	ansel.haley@tigo.tk	1
64	jacky53453	a{/f8utkd;zr1ezs8t8q809	nichole97@manghinsu.com	1
65	laverna77803	hzu!n\\hfs8672	mariana13@speedupmail.us	1
66	casey74616	t*^xvs`x!z7b179	rafaela.morisse@bukanimers.com	1
67	maurine0016	ncv,6f}7dk$qv)mk)h298	zlebsack@ic-vialaurentina710-roma.it	1
68	mschoen955	mi;a{iprc7_^0447	fanny25@gmailni.com	1
70	makenzieconnell305	b%"kxy+omw|f88	lexus.gleason@breaksmedia.com	1
71	rchristiansen750	[zwdmg4\\vo:0169	dagmar81@816qs.com	1
72	haagmyrtice904	m%{,:zixei+hcwf?@&772	ullrich.ignatiu@saxlift.us	1
73	qconnelly750	/&z&&0*8.r_mrpv2wd616	montana.swift@tigo.tk	1
74	antonio95147	`psrsm}ugf,xowl*7100	marley.wyman@bukan.es	1
75	nhoppe316	ds0jj/*_6n9g*ek28	jkutch@cuedigy.com	1
76	zackeryheidenre466	cg)$zevg#almb(423~115	mkunze@freeallapp.com	1
77	nheller94	w1[tj6l2w3s9232	hilpert.axel@tigo.tk	1
78	evansdenesik513	q'bgchn&qz*&|d"g565	jensen10@bukanimers.com	1
79	torphyignacio311	3o+a`e|%kzg)t879	fblock@realsoul.in	1
80	carrolldonald754	s3p=$sp+qvbc502	burnice.ward@deshivideos.com	1
81	wraynor882	%91antl@hsejq?4nkub}757	larson.misty@mailpremium.net	1
82	littelgeovanni354	-)+&2y~wb/!540	camylle.wuckert@tedesafia.com	1
83	koeppbreana296	$z@fs\\|y%`810	kelsie.waelchi@espadahost.com	1
84	vicentekassulke808	d1\\dm%+pv2es553	kiehn.quinn@posthectomie.info	1
85	yazmin10158	^20'csz'xff_544	schneider.reta@puan.tech	1
86	shirley03255	}]^gk3^rnj#tvux657	lisette.anderso@dogbackpack.net	1
87	abdul32641	sa:q6ip?o(:731	hoppe.alayna@mailpremium.net	1
10002	fakeadmin1	fakeadmin1	lospolos@hermanos.com	3
0	mainadmin1	mainadmin1	main@tucanos.com	3
88	jan97618	ibwe~vydhz}tl:x.*411	lucinda12@redaksikabar.com	1
1	dbayer592	\\bgrbs0^6km;q/l|];]523	mleffler@onlyu.link	1
3	hnitzsche182	!jjtm#2jlq`uo678	lizzie.ernser@dmxs8.com	1
89	kathryn65858	/fpk};tp4"=552	moen.shanna@chantellegribbon.com	1
90	russelhosea980	+[5^v(7w_ln%#759	shirthe@mexcool.com	1
91	brentcremin328	qbyrc84"wiql7~te268	leonard.purdy@adsensekorea.com	1
92	alisonblick180	-*'-smux%x*173	avis.jenkins@ririsbeautystore.com	1
93	elliot43166	bvpk\\~nbsnk@k4dvnk712	ardella09@adsensekorea.com	1
94	alessandro56176	\\kshf^xiu/=1ive.3550	keshaun51@plexvenet.com	1
95	ullrichaudie355	u0i:xh759vseq4@4k915	sorn@onlyu.link	1
96	jjohnston68	hfsl&.+vjosgiub]b326	camryn86@plexvenet.com	1
97	kshlerinjonatan552	`he{:9jd$h.*t.{z576	bernadine41@speedupmail.us	1
98	elinormarks870	u8!q224|4,spgi733	paula.eichmann@newsote.com	1
99	vweimann849	(qx9ymw40v_815	rosamond77@casanovalar.com	1
101	haleighpadberg25	yamo=j$]*3uj@kp-ut(`390	tamara60@uwucheck.com	1
102	shirley59593	{di^e$}jq,p?h2*5591	friesen.norval@espadahost.com	1
103	halvorsonrae412	$!(?md-]%tis849	schulist.lenora@ic-cadorago.org	1
104	bednarrahul671	x\\7vh-a+f[*6&579	randal.ondricka@gmailpro.ml	1
105	efranecki932	goi%7maz%co}614	giles31@bukan.es	1
106	mauricenikolaus84	1dnhzymvum_u977	aliyah59@guitarsxltd.com	1
107	mannsid168	jp[:5cfkq`1g&!wgus&i441	vfriesen@gmailni.com	1
108	nat64651	qg=8f{q!m.:855	hamill.abner@cuenmex.com	1
109	shanelwyman210	%lq7@5d`op+br1x8d!5988	alexa97@realsoul.in	1
110	lwintheiser816	}qee|g"f}goux`th3k}976	nickolas.jacobi@mailcuk.com	1
111	anibalmills441	lam}mn0j]\\ta133	konopelski.lola@mailpremium.net	1
112	riley94530	pf|z]-m;5r:f~3(q372	parisian.nigel@livegolftv.com	1
114	boyd64952	kfv6i_`qo@n_5al131	rath.penelope@alvinneo.com	2
116	ahmed13206	orndijs|wjge}l129	marcel60@kaspar.lol	2
117	henriettetrembl75	@@-*ck:9m$d"901	colin91@longaitylo.com	2
118	boyercarley75	bzpm+4n{skdr=l901	arippin@onlyu.link	2
119	vellawelch180	wdhh}faa(gcvwl`^#154	iva.schamberger@puan.tech	2
120	nbraun365	#wl:2u`{x9u;945	dwolff@casanovalar.com	2
121	bashirianpaige17	'w7l4q,`xb!-ok/|tc893	imayer@bukan.es	2
122	ukuhlman162	')70wfsum.i175	weber.shanel@filevino.com	2
123	clemensstehr679	twh?l8mdf',ph5oo94	mohammed.streic@superhostformula.com	2
124	noemielakin790	}qusv9`c#5np(565	erdman.oren@bandtoo.com	2
125	lkoelpin792	m1mey?{cid$f%302	sstroman@pianoxltd.com	2
126	zhyatt108	|kamgi3oqyv]#ys09g27	orrin.collier@gmailni.com	2
127	carrollearnesti589	o`"ulrksv?655	beatty.kailyn@uwucheck.com	2
128	lynnrogahn50	rpbv*y-ss*ca3769	rbeahan@packiu.com	2
129	larkinhillard443	|vi:a~aeim267	qlesch@otpku.com	2
130	wehnerlydia479	8vbo,%26+|xl626	hermiston.guill@4freemail.org	2
131	roobkennedy946	ckx"&b2nvuo93	kkeebler@ebarg.net	2
132	ithiel369	nd.l+"xvvmi558	santino69@816qs.com	2
133	mitchell712	l(pz2x.${.q(740	jacinthe89@falixiao.com	2
134	mokuneva475	gjnz%67}oy129	xshanahan@24hinbox.com	2
135	fgerlach274	u}eot)[@ow130	lkuvalis@dogbackpack.net	2
136	tbalistreri169	69f1[?hoqt#5evj356	melody.lynch@qws.lol	2
137	cristina49468	ehox65q'f@4|279	cwiza@gmailpro.cf	2
138	vsimonis891	5{p\\s~hset-vkqf882	asmith@kongshuon.com	2
139	grahamtre113	,a-wjyrbda]ql-43	darrel80@mexcool.com	2
140	hadleybatz166	v=7vv}rdco,0e664	eldridge.turcot@qws.lol	2
141	jamalnienow477	k@'en4acvz546	danny87@cudimex.com	2
142	allen51954	ss:bnltvy}jd;236	bmoore@breaksmedia.com	2
143	amparo35757	f2td"`q:)^..xrj6et932	jazmyn42@emvil.com	2
144	faheysarah450	pe-~x7pbm.3	ustehr@gmailpro.ml	2
145	germaine40142	^.z"bl$a4z|;]721	huels.jeramy@cuenmex.com	2
146	zboncakphoebe662	pg?[0hm~rf24	damore.kira@onlineindex.biz	2
147	hoppebrando363	o}`ic2e%!l|nlcyg@t757	price.sydney@digimexplus.com	2
148	ubeatty526	b+u-=%nw=y71	reba.gulgowski@chantellegribbon.com	2
149	gshields26	qdyk~rlq}k`ub'3580	georgiana52@musicandsunshine.com	2
150	berthajacobi822	va-;&zktp`5v7,j!z603	norval.howell@shanemalakas.com	2
151	grayce11988	ye__i_~)u~-@436	schimmel.fletch@freeallapp.com	2
152	penelope57413	%eu4~k%-\\q}832	charris@email-temp.com	2
153	maxwellsimonis212	|g|;fl"grxrhl755	oorn@lompaochi.com	2
154	hanebertha507	$$)@x?;=o:/0ys701	ntorphy@24hinbox.com	2
155	schadenangie168	7=xi*$\\@~~!16	dallin.reinger@wdmail.ml	2
156	benjamincronin630	mf:7fr3jfaj%78	eliane99@ic-vialaurentina710-roma.it	2
157	earnest22402	b^f2"?pu~|w#bdyi99	white.cassie@ic-vialaurentina710-roma.it	2
158	agustina88946	[dm1~^(^8(-772	desmond.bernier@mailpremium.net	2
159	audieoreilly816	j#er(=^+jy_rdl;g(;726	reuben.becker@axaxmail.com	2
160	grahamelmo803	l(5x-f/t!ovych721	abins@reflexologymarket.com	2
161	marisa73319	hf/dnn==v9;g144	chester14@chantellegribbon.com	2
162	zemlakjamarcus966	zvk3aplz_aj719	walker.anastaci@puan.tech	2
163	windlervito714	;ablgihwws329	dillon97@tedesafia.com	2
164	wehnerharvey822	e:]gk\\h2nnr999	abe.bayer@rackabzar.com	2
165	mraznigel368	b.z"9\\&?t8fx;cu719	wyman.lupe@thebuyinghub.net	2
166	ischinner347	vb#[a53%la582	ibeahan@mailpremium.net	2
167	gulgowskishayna733	-.md5gcx[f384	emilie61@tearflakes.com	2
168	wolffmatilde575	|3n$9qp?e@216	dannie04@freeallapp.com	2
169	mabel96805	r+8c~=b4igj1g`*{yf793	wterry@mailsaviors.com	2
170	antonedeckow999	;t^y'}$"n^205	rodger.daughert@plexvenet.com	2
171	ykiehn328	qy{eq=t%p_ai595	sharvey@onlineindex.biz	2
172	viva65497	rjgtrwk]5t'/120	rohan.javonte@espadahost.com	2
173	kassulkewilber8	o+?xsyf9atb}z359	mckenzie.willms@dmxs8.com	2
174	adalinekirlin252	(u(&]z[ijx*a@ppq:.801	rath.ana@falixiao.com	2
175	abbottreyes70	'f:k&pahs}zp*++@-x298	qwindler@greendike.com	2
176	espencer802	sh)=-'c4y?z268	schamberger.ver@adsensekorea.com	2
177	bergstromzula294	gyqd+ve:sc.|5u*6w1+715	piper11@hotmail.red	2
178	jenkinstina418	mq*+'+'0ib\\\\245	pschiller@packiu.com	2
179	zakaryboyer580	\\ii$$qc]3dy,=v6$r422	pacocha.heaven@uhpanel.com	2
180	altaschinner45	ux3'a"nxi%tp995	kelli.green@ebarg.net	2
181	grahamjessyca656	{qy;g-`d&c340	fblick@mailcuk.com	2
182	powlowskipietro150	zi=is){cjmrj;457	arielle75@wdmail.ml	2
183	nayeli54290	6-,}62u}r:t.+z781	ybauch@cudimex.com	2
184	soledadweber960	fptedj=yq_t~'g-339	jammie.sipes@shanghongs.com	2
185	rhea63896	dpprli%lzk!.a[y[cs|753	tspencer@naverapp.com	2
186	elnora64287	c`|qecbiaf188	hettinger.londo@uwucheck.com	2
187	pauladurgan526	vl(n48d.w(v666	modesto02@unair.nl	2
188	tremblayrory983	kby!#/7ybmce}k0:5	okuvalis@naverapp.com	2
189	sparker68	}fyo0(7@^swf_k]^t;64	yeichmann@mailsaviors.com	2
190	rennermaureen317	fn,5qct=p2t8lxkbt27	kacie83@gmailvn.net	2
191	billy46769	3vq6+^yhve98	olson.charlotte@digimexplus.com	2
192	lonzobaumbach496	jyoet+#s!lg=j&w%48	cole.marina@gmailni.com	2
193	broberts320	4u0ivmj0v?1uqs_-ki206	mschamberger@uhpanel.com	2
194	qhessel413	ewo2rs.d+qjnn_9skze708	yzulauf@vittato.com	2
195	sabryna33650	cpht$gb*g?{dd9^2v695	lessie99@falixiao.com	2
196	uturcotte116	^zio?6oce=,;159	dwight.medhurst@gmailpro.ml	2
197	ronaldo02175	evbhzz+4@l618	nadia.moen@cuedigy.com	2
198	maegan11539	hgvvb2us_|aj?381	adalberto.boyer@newsote.com	2
199	myracorwin196	z&nqylo,zwebyv|k2339	forest50@packiu.com	2
200	herzogsamson695	/i3axzyj7nu7.mm466	lgaylord@redaksikabar.com	2
201	vbalistreri855	03xncrwcam973	oda64@qws.lol	2
202	hyattfiona896	%pa4`j7\\bwz221	myles.dooley@lompaochi.com	2
203	anitaberge294	cz=ev22ozbw-8q/o)171	stella.morisset@alvinneo.com	2
204	christopher80513	g9(^+u;$uyok748	katheryn18@4freemail.org	2
205	wschuster799	!#@=5c(*kmij`w/nd270	nicolas.janis@tedesafia.com	2
206	anitzsche202	@%^|awg`(sb#{lf"rm_179	sgleason@ic-cadorago.org	2
207	delta28634	dvxvxu\\^ks;m857	hayes.june@picsviral.net	2
208	corneliusherman845	}abu3xsw42.oteu}715	ylegros@ic-vialaurentina710-roma.it	2
209	horace97900	#y]}3b;ss$1p#q+r)715	wilson.cartwrig@onlineindex.biz	2
210	ubaldohowell789	c@}*3-_i"~(n309	bernardo.satter@gmailpro.cf	1
211	edicki881	jd7;'dt"uj|250	sgaylord@tqc-sheen.com	1
212	kenyonwatsica796	iu)a{'d)xytsw|au`%12	keeling.eryn@bukan.es	1
213	vancewitting567	%hv78x7_o\\|sy607	gabe.padberg@netveplay.com	1
214	mdietrich426	vio.%2n`{uv#361	ibraun@cudimex.com	1
215	arno7723	m+t\\rw3xgv'i"h328	ethyl.kuphal@shanemalakas.com	1
216	fhowe223	hyw+wq9lplsgc516	ritchie.name@papakiung.com	1
217	korn8	`){zuu^&bs149e]gl218	jasen04@galvanitrieste.it	1
218	arnaldo39927	!t:1k[s70fqk127	lexi22@tearflakes.com	1
219	broderickdaniel903	m^t|sd|7x(jv:n388	erwin.fritsch@ic-vialaurentina710-roma.it	1
220	ova38495	aswm$#xm3lr3wr=m622	lloyd88@hotmail.red	1
221	sreinger619	s:$##yrx#8|5yy-m5d814	mgislason@hoanguhanho.com	1
222	amie06110	{z-d3b_4nt0&7t*$z599	marcos02@mymailcr.com	1
223	joannie31825	-(-nst_n}|||caqu583	pattie16@cudimex.com	1
224	hettingerabner428	rvaxpw;^zaw!919	sanford.haylee@breaksmedia.com	1
225	ullrichjazmin978	53?uns||vu8.?387	quincy.hilll@galvanitrieste.it	1
226	cameron42609	:~o"v[9l+g9|467	giovani41@cuendita.com	1
227	diamondgutmann983	r$1qd"rk.;k777	lehner.edgar@tedesafia.com	1
228	sschuster233	i,t)g\\t[39y335	trenton.bahring@luddo.me	2
229	haagmonte806	,:g16|l"+..cu,"s-573	bergstrom.carli@cuendita.com	2
230	alena25948	0fx|4a"dl9i]xa204	cordell.lehner@galvanitrieste.it	2
69	leuschkeeleanor42	ivx1'+wrw69+243	carmelo.walter@gmailpro.cf	1
113	dietrichclaudia630	o`euk%h#m`h%5$-s216	iritchie@btcmod.com	2
10001	fakeairline1	fakeairline1	shelby@birmingham.com	2
231	dasdasdas	dasdasdsad	dasdas@fadsa.com	1
2	twelch903	/`|!1pfu)=s%&v6%dyu428	sabina.west@mymailcr.com	1
115	morrisnikolaus616	?}$3gim=f1un5596	zschmitt@tigo.tk	2
232	dsdsdsda	dasdadsdd	dsadsa@gmil.com	2
\.


--
-- Data for Name: users_role; Type: TABLE DATA; Schema: Flight_Project; Owner: postgres
--

COPY "Flight_Project".users_role (id, role_name) FROM stdin;
1	Customer
2	AirlineCompany
3	Administrator
\.


--
-- Name: adminstrators_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".adminstrators_id_seq', 1, false);


--
-- Name: airline_companies_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".airline_companies_id_seq', 100, true);


--
-- Name: airline_creation_requests_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".airline_creation_requests_id_seq', 5, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".countries_id_seq', 31, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".customers_id_seq', 102, true);


--
-- Name: flights_history_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".flights_history_id_seq', 100, true);


--
-- Name: flights_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".flights_id_seq', 50, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".reviews_id_seq', 100, true);


--
-- Name: ticket_history_customer_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".ticket_history_customer_id_seq', 1, false);


--
-- Name: ticket_history_flight_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".ticket_history_flight_id_seq', 1, false);


--
-- Name: ticket_history_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".ticket_history_id_seq', 504, true);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".tickets_id_seq', 1184, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".users_id_seq', 394, true);


--
-- Name: users_role_id_seq; Type: SEQUENCE SET; Schema: Flight_Project; Owner: postgres
--

SELECT pg_catalog.setval('"Flight_Project".users_role_id_seq', 1, false);


--
-- Name: adminstrators adminstrators_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".adminstrators
    ADD CONSTRAINT adminstrators_pk PRIMARY KEY (id);


--
-- Name: adminstrators adminstrators_uuserid; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".adminstrators
    ADD CONSTRAINT adminstrators_uuserid UNIQUE (user_id);


--
-- Name: airline_companies airline_companies_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_companies
    ADD CONSTRAINT airline_companies_pk PRIMARY KEY (id);


--
-- Name: airline_companies airline_companies_uname; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_companies
    ADD CONSTRAINT airline_companies_uname UNIQUE (name);


--
-- Name: airline_companies airline_companies_uuserid; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_companies
    ADD CONSTRAINT airline_companies_uuserid UNIQUE (user_id);


--
-- Name: airline_creation_requests airline_creation_requests_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_creation_requests
    ADD CONSTRAINT airline_creation_requests_pk PRIMARY KEY (id);


--
-- Name: countries country_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".countries
    ADD CONSTRAINT country_pk PRIMARY KEY (id);


--
-- Name: countries country_uname; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".countries
    ADD CONSTRAINT country_uname UNIQUE (name);


--
-- Name: customers customers_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".customers
    ADD CONSTRAINT customers_pk PRIMARY KEY (id);


--
-- Name: customers customers_ucredit_card_no; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".customers
    ADD CONSTRAINT customers_ucredit_card_no UNIQUE (credit_card_no);


--
-- Name: customers customers_uphone_no; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".customers
    ADD CONSTRAINT customers_uphone_no UNIQUE (phone_no);


--
-- Name: customers customers_uuser_id; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".customers
    ADD CONSTRAINT customers_uuser_id UNIQUE (user_id);


--
-- Name: flights_history flights_history_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".flights_history
    ADD CONSTRAINT flights_history_pk PRIMARY KEY (id);


--
-- Name: flights flights_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".flights
    ADD CONSTRAINT flights_pk PRIMARY KEY (id);


--
-- Name: reviews reviews_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".reviews
    ADD CONSTRAINT reviews_pk PRIMARY KEY (id);


--
-- Name: ticket_history ticket_history_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".ticket_history
    ADD CONSTRAINT ticket_history_pk PRIMARY KEY (id);


--
-- Name: tickets tickets_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".tickets
    ADD CONSTRAINT tickets_pk PRIMARY KEY (id);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: users_role users_role_pk; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users_role
    ADD CONSTRAINT users_role_pk PRIMARY KEY (id);


--
-- Name: users_role users_role_uname; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users_role
    ADD CONSTRAINT users_role_uname UNIQUE (role_name);


--
-- Name: users users_uemail; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users
    ADD CONSTRAINT users_uemail UNIQUE (email);


--
-- Name: users users_upassword; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users
    ADD CONSTRAINT users_upassword UNIQUE (password);


--
-- Name: users users_uusername; Type: CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users
    ADD CONSTRAINT users_uusername UNIQUE (username);


--
-- Name: adminstrators adminstrators_fk_users_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".adminstrators
    ADD CONSTRAINT adminstrators_fk_users_id FOREIGN KEY (user_id) REFERENCES "Flight_Project".users(id);


--
-- Name: airline_companies airline_companies_fk_countries_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_companies
    ADD CONSTRAINT airline_companies_fk_countries_id FOREIGN KEY (country_id) REFERENCES "Flight_Project".countries(id);


--
-- Name: airline_companies airline_companies_fk_users_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_companies
    ADD CONSTRAINT airline_companies_fk_users_id FOREIGN KEY (user_id) REFERENCES "Flight_Project".users(id);


--
-- Name: airline_creation_requests airline_creation_requests_fk; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".airline_creation_requests
    ADD CONSTRAINT airline_creation_requests_fk FOREIGN KEY (country) REFERENCES "Flight_Project".countries(id);


--
-- Name: customers customers_fk_users_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".customers
    ADD CONSTRAINT customers_fk_users_id FOREIGN KEY (user_id) REFERENCES "Flight_Project".users(id);


--
-- Name: flights flights_fk1_countries_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".flights
    ADD CONSTRAINT flights_fk1_countries_id FOREIGN KEY (origin_country_id) REFERENCES "Flight_Project".countries(id);


--
-- Name: flights flights_fk2_countries_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".flights
    ADD CONSTRAINT flights_fk2_countries_id FOREIGN KEY (destination_country_id) REFERENCES "Flight_Project".countries(id);


--
-- Name: flights flights_fk_airlines_companies_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".flights
    ADD CONSTRAINT flights_fk_airlines_companies_id FOREIGN KEY (airlinecompany_id) REFERENCES "Flight_Project".airline_companies(id);


--
-- Name: reviews reviews_fk; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".reviews
    ADD CONSTRAINT reviews_fk FOREIGN KEY (airline_id) REFERENCES "Flight_Project".airline_companies(id);


--
-- Name: reviews reviews_fk_1; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".reviews
    ADD CONSTRAINT reviews_fk_1 FOREIGN KEY (customer_id) REFERENCES "Flight_Project".customers(id);


--
-- Name: tickets tickets_fk_customers_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".tickets
    ADD CONSTRAINT tickets_fk_customers_id FOREIGN KEY (customer_id) REFERENCES "Flight_Project".customers(id);


--
-- Name: tickets tickets_fk_flights_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".tickets
    ADD CONSTRAINT tickets_fk_flights_id FOREIGN KEY (flight_id) REFERENCES "Flight_Project".flights(id);


--
-- Name: users users_fk_users_id; Type: FK CONSTRAINT; Schema: Flight_Project; Owner: postgres
--

ALTER TABLE ONLY "Flight_Project".users
    ADD CONSTRAINT users_fk_users_id FOREIGN KEY (user_role) REFERENCES "Flight_Project".users_role(id);


--
-- PostgreSQL database dump complete
--

